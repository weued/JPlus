/**
 * @author hust_小C
 */
(function(){

    if (window.reMarker || window.r) {
        throw "reMarker is exist"
    };
    window.reMarker = window.r = m = function(tpl, data){
        this.tpl = tpl;
        this.data = data;
        this.scope = null;
        this.vars = [];
    }
    window.r.regRuler = {
        ruler: function(str){
            var listArr = r.util.removeEmpty(str.split(' '));
            /*这里如果不用function而直接return回替换值的话，千次执行会快出5毫秒，和机器有关             switch(listArr[0]){
             case "list": return this.rulerList(listArr);break;
             case "if":  return 'if(' + listArr.slice(1).join('') + '){';break;
             case "break": return 'break;';break;
             case '/#list': return '}})();';break;
             case 'else': return '}else{';break;
             case "/#if": return '}';break;
             case 'elseif':return '}else if(' + listArr.slice(1).join('') + '){';break;
             case 'switch':return 'switch(' + listArr.join('').replace('switch','') + '){';break;
             case 'case': return ('case ' + listArr[1] + ':');break;
             case 'default':return 'default:';break;
             case '/#switch': return '}';
             }
             */
            var ruler = {
                "list": this.rulerList,
                "if": this.rulerIf,
                "break": this.rulerBreak,
                '/#list': this.rulerEndList,
                'else': this.rulerElse,
                "/#if": this.rulerEndIf,
                'elseif': this.rulerElseIf,
                'switch': this.rulerSwitch,
                'case': this.rulerCase,
                'default': this.rulerDefault,
                '/#switch': this.rulerEndSwitch
            };
            return (ruler[listArr[0]]).call(this, listArr);
            
        },
        rulerEndSwitch:function(arr){
            return '}';
        },
        rulerCase:function(arr){
            return ('case ' + arr[1] + ':');
        },
        rulerDefault:function(){
            return 'default:'
        },
        rulerSwitch:function(arr){
            return 'switch(' + arr.join('').replace('switch','') + '){'
        },
        rulerElseIf:function(){
            if(arr.length<2){return false;}
            return '}else if(' + arr.slice(1).join('') + '){';
        },
        rulerBreak:function(){
            return 'break;'
        },
        rulerElse:function(arr){
            return '}else{';
        },
        rulerEndIf:function(arr){
            return '}';
        },
        rulerIf: function(arr){
            if(arr.length<2){return false;}
             return 'if(' + arr.slice(1).join('') + '){'
        },
        rulerEndList:function(arr){
            return '}})();';
        },
        rulerList:function(arr){
            var listName, loopName, loopIndexName, loopHasNextName, result = [];
             if(arr.length!=4){return;}
             loopName=arr[3];
             listName=arr[1];
             loopIndexName = loopName + '_index';
             loopHasNextName = loopName + '_has_next';
             
             result.push('(function(){');
            if (!/^\w+$/.test(listName)) {
                result.push('var _list=' + listName + ';');
                listName = '_list';
            }
            result.push(['var _i=0', '_count=' + listName + '.length', loopName, loopIndexName, loopHasNextName + ';'].join(','));
            result.push('for(;_i<_count;_i++){');
            result.push(loopName + '=' + listName + '[_i];');
            result.push(loopIndexName + '=_i;');
            result.push(loopHasNextName + '=_i!==_count-1;');
            return result.join('');
        }
    }
    window.r.util = {
        trim: function(str){
            return this.replace(/(^\s*)|(\s*$)/g, "");
        },
        lTrim: function(str){
            return this.replace(/(^\s*)/g, "");
        },
        rTrim: function(str){
            return this.replace(/(\s*$)/g, "");
        },
        removeEmpty: function(arr){
            return arr.join(',').replace(',,', ',').split(',');
        }
    }
    m.prototype.process = function(data, scope){
        return this.splitVar(this.tpl);
        
    };
    
    m.prototype.splitVar = function(tpl){
        var chunks = [], idx = 0, lastIndex = 0, le = tpl.length;
        var self = this;
        var printPrefix = "__buf__.push(";
        var replaced = [];
        tpl=tpl.replace("\r\n",'').replace("\t",'');
        function pushStr(str){
            str = str.replace(/'/g, "\\'");
            if (str !== '') {
                replaced.push(printPrefix + '\'' + str + '\');');
            }
        }
        var peek = function(tok){
                if (tok == "<") {
                    if (tpl[idx + 1] == "#" && tpl[idx + 2] == "-" && tpl[idx + 2] == "-") {
                        findEnd(">");
                        chunks.push(tpl.substring(lastIndex, idx));
                        pushStr(chunks[chunks.length-1].replace("#",'!'));
                        return true;
                    }
                    else 
                        if (tpl[idx + 1] == "#") {
                            findEnd(">");
                            chunks.push(tpl.substring(lastIndex, idx));
                            replaced.push(r.regRuler.ruler(chunks[chunks.length-1].slice(2, -1)));
                            return true;
                        }
                        else 
                            if (tpl[idx + 1] == "/" && tpl[idx + 2] == "#") {
                                findEnd(">");
                                chunks.push(tpl.substring(lastIndex, idx));
                                replaced.push(r.regRuler.ruler(chunks[chunks.length-1].slice(1, -1)))
                                return true;
                            }
                }
                else if(tok=="$") {
                    if (tpl[idx + 1] == "{") {
                        findEnd("}");
                        chunks.push(tpl.substring(lastIndex, idx));
                        replaced.push(printPrefix + chunks[chunks.length-1].slice(2, -1) + ');');
                        return true;
                    }
                }else{
                    
            return false;
                    
                }

        }
        var findEnd = function(tok){
            for (var i = idx+2 ; i < le; i++) {
                    if (tpl[i] == tok) {
                        //增加非语法句
                        if (tpl[lastIndex] != '<') {
                            chunks.push(tpl.substring(lastIndex, idx))
                            pushStr(chunks[chunks.length-1]);
                        }
                        lastIndex = idx;
                        idx = i + 1;
                        break;
                    }
            }
        }
        
        while (idx < le) {
            if (peek(tpl[idx])) {
                //增加语法句
                lastIndex = idx;
            }
            else {
                idx++;
            }
        }
        
        
        chunks.push(tpl.substring(lastIndex));
        replaced.push(tpl.substring(lastIndex))
        
        replaced = ["var __buf__=[],$index=null;$util.print=function(str){__buf__.push(str);};with($data){", replaced.join(''), "} return __buf__.join('');"].join('');
        //need 4ms when the function is null
        this.compiled = new Function("$data", "$util", replaced);
        var util = {};
        if (m.util) {
            var _util = m.util;
            for (var key in _util) {
                util[key] = _util[key];
            }
        }
        return this.compiled.call(this.scope || window, this.data, util);
    };
    
    m.prototype.log = function(){
        if (typeof(console) !== "undefined") {
            for (var i = 0; i < arguments.length; i++) {
                console.log(arguments[i]);
            }
        }
    };
    
})();