
Ext.data.Store = function(config){
    this.data = new Ext.util.MixedCollection(false);
    this.data.getKey = function(o){
        return o.id;
    };
    this.baseParams = {};
    this.paramNames = {
        "start" : "start",
        "limit" : "limit",
        "sort" : "sort",
        "dir" : "dir"
    };
    Ext.apply(this, config);

    if(this.reader && !this.recordType){ 
        this.recordType = this.reader.recordType;
    }

    this.fields = this.recordType.prototype.fields;

    this.modified = [];

    this.addEvents({
        
        datachanged : true,
        
        add : true,
        
        remove : true,
        
        update : true,
        
        clear : true,
        
        beforeload : true,
        
        load : true,
        
        loadexception : true
    });

    if(this.proxy){
        this.relayEvents(this.proxy,  ["loadexception"]);
    }
    this.sortToggle = {};
    
    Ext.data.Store.superclass.constructor.call(this);
};
Ext.extend(Ext.data.Store, Ext.util.Observable, {
    
    
    
    
    
    remoteSort : false,

    
    lastOptions : null,

    
    add : function(records){
        records = [].concat(records);
        for(var i = 0, len = records.length; i < len; i++){
            records[i].join(this);
        }
        var index = this.data.length;
        this.data.addAll(records);
        this.fireEvent("add", this, records, index);
    },

    
    remove : function(record){
        var index = this.data.indexOf(record);
        this.data.removeAt(index);
        this.fireEvent("remove", this, record, index);
    },

    
    removeAll : function(){
        this.data.clear();
        this.fireEvent("clear", this);
    },

    
    insert : function(index, records){
        records = [].concat(records);
        for(var i = 0, len = records.length; i < len; i++){
            this.data.insert(index, records[i]);
            records[i].join(this);
        }
        this.fireEvent("add", this, records, index);
    },

    
    indexOf : function(record){
        return this.data.indexOf(record);
    },

    
    indexOfId : function(id){
        return this.data.indexOfKey(id);
    },

    
    getById : function(id){
        return this.data.key(id);
    },

    
    getAt : function(index){
        return this.data.itemAt(index);
    },

    
    getRange : function(start, end){
        return this.data.getRange(start, end);
    },

    
    storeOptions : function(o){
        o = Ext.apply({}, o);
        delete o.callback;
        delete o.scope;
        this.lastOptions = o;
    },

    
    load : function(options){
        options = options || {};
        if(this.fireEvent("beforeload", this, options) !== false){
            this.storeOptions(options);
            var p = Ext.apply(options.params || {}, this.baseParams);
            if(this.sortInfo && this.remoteSort){
                var pn = this.paramNames;
                p[pn["sort"]] = this.sortInfo.field;
                p[pn["dir"]] = this.sortInfo.direction;
            }
            this.proxy.load(p, this.reader, this.loadRecords, this, options);
        }
    },

    
    reload : function(options){
        this.load(Ext.applyIf(options||{}, this.lastOptions));
    },

    
    
    loadRecords : function(o, options, success){
        if(!o || success === false){
            if(success !== false){
                this.fireEvent("load", this, [], options);
            }
            if(options.callback){
                options.callback.call(options.scope || this, [], options, false);
            }
            return;
        }
        var r = o.records, t = o.totalRecords || r.length;
        for(var i = 0, len = r.length; i < len; i++){
            r[i].join(this);
        }
        if(!options || options.add !== true){
            this.data.clear();
            this.data.addAll(r);
            this.totalLength = t;
            this.applySort();
            this.fireEvent("datachanged", this);
        }else{
            this.totalLength = Math.max(t, this.data.length+r.length);
            this.data.addAll(r);
        }
        this.fireEvent("load", this, r, options);
        if(options.callback){
            options.callback.call(options.scope || this, r, options, true);
        }
    },

    
    loadData : function(o, append){
        var r = this.reader.readRecords(o);
        this.loadRecords(r, {add: append}, true);
    },

    
    getCount : function(){
        return this.data.length || 0;
    },

    
    getTotalCount : function(){
        return this.totalLength || 0;
    },

    
    getSortState : function(){
        return this.sortInfo;
    },

    
    applySort : function(){
        if(this.sortInfo && !this.remoteSort){
            var s = this.sortInfo, f = s.field;
            var st = this.fields.get(f).sortType;
            var fn = function(r1, r2){
                var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
                return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
            };
            this.data.sort(s.direction, fn);
            if(this.snapshot && this.snapshot != this.data){
                this.snapshot.sort(s.direction, fn);
            }
        }
    },

    
    setDefaultSort : function(field, dir){
        this.sortInfo = {field: field, direction: dir ? dir.toUpperCase() : "ASC"};
    },

    
    sort : function(fieldName, dir){
        var f = this.fields.get(fieldName);
        if(!dir){
            if(this.sortInfo && this.sortInfo.field == f.name){ 
                dir = (this.sortToggle[f.name] || "ASC").toggle("ASC", "DESC");
            }else{
                dir = f.sortDir;
            }
        }
        this.sortToggle[f.name] = dir;
        this.sortInfo = {field: f.name, direction: dir};
        if(!this.remoteSort){
            this.applySort();
            this.fireEvent("datachanged", this);
        }else{
            this.load(this.lastOptions);
        }
    },

    
    each : function(fn, scope){
        this.data.each(fn, scope);
    },

    
    getModifiedRecords : function(){
        return this.modified;
    },

    
    filter : function(property, value){
        if(!value.exec){ 
            value = String(value);
            if(value.length == 0){
                return this.clearFilter();
            }
            value = new RegExp("^" + Ext.escapeRe(value), "i");
        }
        this.filterBy(function(r){
            return value.test(r.data[property]);
        });
    },

    
    filterBy : function(fn, scope){
        var data = this.snapshot || this.data;
        this.snapshot = data;
        this.data = data.filterBy(fn, scope);
        this.fireEvent("datachanged", this);
    },

    
    clearFilter : function(suppressEvent){
        if(this.snapshot && this.snapshot != this.data){
            this.data = this.snapshot;
            delete this.snapshot;
            if(suppressEvent !== true){
                this.fireEvent("datachanged", this);
            }
        }
    },

    
    afterEdit : function(record){
        if(this.modified.indexOf(record) == -1){
            this.modified.push(record);
        }
        this.fireEvent("update", this, record, Ext.data.Record.EDIT);
    },

    
    afterReject : function(record){
        this.modified.remove(record);
        this.fireEvent("update", this, record, Ext.data.Record.REJECT);
    },

    
    afterCommit : function(record){
        this.modified.remove(record);
        this.fireEvent("update", this, record, Ext.data.Record.COMMIT);
    },

    
    commitChanges : function(){
        var m = this.modified.slice(0);
        this.modified = [];
        for(var i = 0, len = m.length; i < len; i++){
            m[i].commit();
        }
    },

    
    rejectChanges : function(){
        var m = this.modified.slice(0);
        this.modified = [];
        for(var i = 0, len = m.length; i < len; i++){
            m[i].reject();
        }
    }
});

Ext.data.SimpleStore = function(config){
    Ext.data.SimpleStore.superclass.constructor.call(this, {
        reader: new Ext.data.ArrayReader({
                id: config.id
            },
            Ext.data.Record.create(config.fields)
        ),
        proxy : new Ext.data.MemoryProxy(config.data)
    });
    this.load();
};
Ext.extend(Ext.data.SimpleStore, Ext.data.Store);

