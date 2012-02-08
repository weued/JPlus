using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Text.RegularExpressions;

namespace Xuld.Tools.DplBuilder {
    public class DplBuilder {

        #region 工具

        static void Warning(string message) {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine(message);
            Console.ResetColor();
        }

        static void EnsureDirectory(string path) {
            Directory.CreateDirectory(Path.GetDirectoryName(path));
        }

        static bool StartWith(string line, string s) {
            if(!line.StartsWith(s) || line.Length < s.Length + 3) {
                return false;
            }

            int p = s.Length;
            char c = line[p];

            while(char.IsWhiteSpace(c) && p < line.Length) {
                c = line[++p];
            }

            if(c == '(' || c == '.') {
                return true;
            }

            return false;
        }

        static string Combine(string path1, string path2) {
            return Path.GetFullPath(Path.Combine(Path.GetDirectoryName(path1), path2));
        }

        static void CopyFile(string fromFile, string toFile) {

            try {
                EnsureDirectory(toFile);
                File.Copy(fromFile, toFile, true);
            } catch(Exception e) {
                Warning(e.Message);
            }
        }


        #endregion

        #region 成员

        Encoding _encoding = Encoding.UTF8;

        public Encoding Encoding {
            get {
                return _encoding;
            }
            set {
                _encoding = value;
            }
        }

        string _workingDirectory;

        public string WorkingDirectory {
            get {
                return _workingDirectory;
            }
            set {
                _workingDirectory = Path.GetFullPath(value);
            }
        }

        string _toCssFile;

        public string ToCssFile {
            get {
                return _toCssFile;
            }
            set {
                _toCssFile = Path.GetFullPath(value);
            }
        }

        string _toJsFile;

        public string ToJsFile {
            get {
                return _toJsFile;
            }
            set {
                _toJsFile = Path.GetFullPath(value);
            }
        }

        string _imageRelative;

        public string ImageRelative {
            get {
                return _imageRelative;
            }
            set {
                if(value == null) {
                    value = "/";
                } else if(!value.EndsWith("/")) {
                    value += '/';
                }
                _imageRelative = value;
            }
        }

        string _newLine = "\n";

        public string NewLine {
            get {
                return _newLine;
            }
            set {
                _newLine = value;
            }
        }

        Dictionary<string, bool> _sources = new Dictionary<string, bool>();

        StreamWriter _css;

        StreamWriter _js;

        public bool DisableJsTrace {
            get;
            set;
        }

        public bool DisableJsAssert {
            get;
            set;
        }

        #endregion

        #region 方法

        public void BuildAll(List<string> targets) {

            _css = CreateWriter(ToCssFile);
            _js = CreateWriter(ToJsFile);

            foreach(string target in targets) {
                ScanTarget(target);
            }

            _css.Dispose();
            _js.Dispose();
        }

        private void ScanTarget(string nameOrPath) {

            string name;
            string path;

            try {

                ResolveNamespace(nameOrPath, true, out path, out name);
                TryScanFile(path, name, true);



                ResolveNamespace(nameOrPath, false, out path, out name);
                TryScanFile(path, name, false);


            } catch(Exception e) {
                Warning(nameOrPath + ": " + e.Message);
            }



        }

        void WriteHeader(StreamWriter writer, string name) {
            writer.WriteLine("/************************************");
            writer.Write(" * ");
            writer.WriteLine(name);
            writer.WriteLine(" ************************************/");
        }

        void ScanJavascript(string path, string name) {

            string[] lines = File.ReadAllLines(path, _encoding);

            int i = 0;

            for(; i < lines.Length; i++) {
                string c = lines[i].TrimStart();
                if(StartWith(c, "using")) {
                    c = CleanUsings(c, 5);
                    if(c != null)
                        ScanNamespace(c, true);
                } else if(StartWith(c, "imports")) {
                    c = CleanUsings(c, 7);
                    if(c != null)
                        ScanNamespace(c, false);
                } else if(DisableJsTrace && StartWith(c, "trace")) {
                    continue;
                } else if(DisableJsAssert && StartWith(c, "assert")) {
                    continue;
                } else if(c.Length == 0 || (c.Length > 1 && c[0] == '*') || (c.Length > 2 && c[0] == '/' && (c[1] == '/' || c[1] == '*'))) {

                } else {
                    break;
                }

            }

            Console.WriteLine(name);
            WriteHeader(_js, name);

            for(; i < lines.Length; i++) {
                string c = lines[i].TrimStart();
                if(StartWith(c, "using") || StartWith(c, "imports")) {
                    Warning((StartWith(c, "using") ? "using" : "imports") + "(行" + i + ") 只能在最开始使用。");
                } else if(DisableJsTrace && StartWith(c, "trace")) {
                    continue;
                } else if(DisableJsAssert && StartWith(c, "assert")) {
                    continue;
                }
                _js.WriteLine(lines[i]);
            }

            //  _js.WriteLine("namespace(\"" + name + "\");");
        }

        static string CleanUsings(string value, int left) {
            int right = value.Length - 1;
            bool containsQuote = false;
            for(; left < value.Length; left++) {
                char c = value[left];
                if(c == '(')
                    containsQuote = true;
                if(Char.IsLetterOrDigit(c) || c == '.') {
                    break;
                }
            }

            for(; right >= 0; right--) {
                char c = value[right];
                if(Char.IsLetterOrDigit(c) || c == '.') {
                    break;
                }
            }

            if(containsQuote && left < right) {
                return value.Substring(left, right - left + 1);
            }

            return null;
        }

        static Regex _lastP = new Regex(@"(\.[^.]+)$");

        void ResolveNamespace(string nameOrPath, bool isJs, out string path, out string name) {
            if(String.IsNullOrEmpty(nameOrPath)) {
                name = path = null;
                return;
            }

            if(nameOrPath.IndexOf('/') >= 0) {
                name = nameOrPath;
                path = Path.GetFullPath(_workingDirectory + '/' + nameOrPath);
                return;
            }

            name = nameOrPath;

            path = nameOrPath.ToLowerInvariant();

            if(path.StartsWith("controls.")) {
                path = _lastP.Replace(path, isJs ? ".assets.scripts$1" : ".assets.styles$1");
            } else if(path == "system.dom.element"){
                path = null;
                return;
            } else {
                path = "src." + path;
            }

            path = path.Replace('.', '/') + (isJs ? ".js" : ".css");

            path = Path.GetFullPath(_workingDirectory + '/' + path);
        }

        private void ScanNamespace(string nameOrPath, bool isJs) {
            string name;
            string path;

            ResolveNamespace(nameOrPath, isJs, out path, out name);

            if(path != null) {
                ScanFile(path, name, isJs);
            }
        }

        bool TryScanFile(string path, string name, bool isJs) {
            if(_sources.ContainsKey(path))
                return true;

            if(!File.Exists(path)) {
                return false;
            }

            _sources[path] = true;

            if(isJs)
                ScanJavascript(path, name);
            else
                ScanCss(path, name);




            return true;
        }

        /// <summary>
        /// 扫描一个文件。
        /// </summary>
        void ScanFile(string path, string name, bool isJs) {
            if(_sources.ContainsKey(path))
                return;

            if(!File.Exists(path)) {
                Warning("找不到文件 " + path);
                return;
            }


            _sources[path] = true;


            if(isJs)
                ScanJavascript(path, name);
            else
                ScanCss(path, name);


        }

        static Regex _image = new Regex(@"url\s*\((['""]?)(.*)\1\)");

        static string GetParentName(string name) {
            int i = name.LastIndexOf('.');
            if(i > 0) {
                int j = name.LastIndexOf('.', i - 1);

                if(j >= 0) {
                    name = name.Substring(j + 1, i - j - 1);
                }
            }
            return name.ToLowerInvariant();
        }

        string ResolveAllImages(string line, string path, string name) {
            string cn = GetParentName(name);
            return _image.Replace(line, t => {
                string path2 = t.Groups[2].Value;
                string targetPath = String.Concat(ImageRelative, cn, "/", Path.GetFileName(path2));
                string srfFile = Combine(path, path2);
                if(!_sources.ContainsKey(srfFile)) {
                    _sources[srfFile] = false;
                    CopyFile(srfFile, Combine(ToCssFile, targetPath));
                }
                return String.Concat("url(", targetPath, ")");
            });
        }

        void ScanCss(string path, string name) {

            //  Console.WriteLine("Css: {0}", name);

            WriteHeader(_css, name);


            foreach(string line in File.ReadAllLines(path, _encoding)) {
                if(line.IndexOf("url(") >= 0) {
                    _css.WriteLine(ResolveAllImages(line, path, name));
                } else {
                    _css.WriteLine(line);
                }

            }
        }

        StreamWriter CreateWriter(string path) {

            EnsureDirectory(path);

            StreamWriter writer = new StreamWriter(path, false, _encoding);

            writer.NewLine = _newLine;

            writer.WriteLine("/*");
            writer.Write(" * This file is created by a tool at ");
            writer.WriteLine(DateTime.Now.ToString("yyyy/MM/dd hh:mm:ss"));
            writer.WriteLine(" */");
            writer.WriteLine();
            writer.WriteLine();


            return writer;
        }

        //void BuildAll(string fromFolder, StreamWriter toCss, StreamWriter toJs, List<string> targets, string toCssFile, string toImagesFolder) {

        //    // button/aa/index.html
        //    List<string> processed = new List<string>(targets.Count);

        //    int m = targets.IndexOf("*");

        //    if(m >= 0) {
        //        foreach(string directory in Directory.GetDirectories(fromFolder)) {
        //            targets.Insert(m++, Path.GetDirectoryName(directory));
        //        }
        //    }



        //    foreach(string target in targets) {

        //        if(target.Length == 0)
        //            continue;


        //        if(target[0] == '_') {
        //            continue;
        //        }

        //        if(target[0] == '-') {
        //            processed.Remove(target.Substring(1));
        //            continue;
        //        }


        //        if(target.Contains("/") && !processed.Contains(target)) {
        //            processed.Add(target);
        //            continue;
        //        }


        //        foreach(string file in Directory.GetFiles(fromFolder + target, "*.html")) {
        //            processed.Add(target + "/" + Path.GetFileNameWithoutExtension(file));
        //        }
        //    }



        //    Console.WriteLine();

        //    foreach(string file in processed) {
        //        BuildSingle(fromFolder, file, toCss, toJs, toCssFile, toImagesFolder);
        //    }



        //}

        //void BuildSingle2(string fromFolder, string path, StreamWriter toCss, StreamWriter toJs, string toCssFile, string toImagesFolder) {

        //    // button/btn2.html

        //    // button/btn2
        //    string displayName = path;

        //    Console.WriteLine(displayName);

        //    string fromsFile = fromFolder + path;

        //    string extension = Path.GetExtension(fromsFile);

        //    if(extension == ".css" && File.Exists(fromsFile)) {
        //        toCss.WriteLine("/************************************");
        //        toCss.Write(" * ");
        //        toCss.WriteLine(displayName);
        //        toCss.WriteLine(" ************************************/");

        //        foreach(string line in File.ReadAllLines(fromsFile, _encoding)) {
        //            if(line.IndexOf("url(") >= 0) {
        //                toCss.WriteLine(ResolveAllImages(line, fromsFile, toCssFile, toImagesFolder, "libs"));
        //            } else {
        //                toCss.WriteLine(line);
        //            }

        //        }

        //    }

        //    if(extension == ".js" && File.Exists(fromsFile)) {

        //        toJs.WriteLine("/************************************");
        //        toJs.Write(" * ");
        //        toJs.WriteLine(displayName);
        //        toJs.WriteLine(" ************************************/");

        //        toJs.WriteLine(File.ReadAllText(fromsFile, _encoding));

        //    }
        //}

        //void BuildSingle(string fromFolder, string componentName, StreamWriter toCss, StreamWriter toJs, string toCssFile, string toImagesFolder) {

        //    if(componentName[0] == '.') {
        //        BuildSingle2(fromFolder, componentName, toCss, toJs, toCssFile, toImagesFolder);
        //        return;
        //    }

        //    // button/btn2.html

        //    int i = componentName.IndexOf('/');



        //    // button
        //    string controlName = componentName.Substring(0, i);

        //    fromFolder += controlName + '\\';

        //    // button/btn2
        //    componentName = componentName.Substring(i + 1);

        //    // button/btn2
        //    string displayName = controlName + "/" + componentName;

        //    Console.WriteLine(displayName);

        //    string fromCssFile = fromFolder + "assets\\styles\\" + componentName + ".css";
        //    if(File.Exists(fromCssFile)) {
        //        toCss.Write("/************************************\n");
        //        toCss.Write(" * ");
        //        toCss.Write(displayName);
        //        toCss.Write("\n ************************************/\n");

        //        foreach(string line in File.ReadAllLines(fromCssFile, _encoding)) {
        //            if(line.IndexOf("url(") >= 0) {
        //                toCss.Write(ResolveAllImages(line, fromCssFile, toCssFile, toImagesFolder, controlName));
        //            } else {
        //                toCss.Write(line);
        //            }

        //            toCss.Write('\n');
        //        }

        //    }

        //    string fromJsFile = fromFolder + "assets\\scripts\\" + componentName + ".js";

        //    if(File.Exists(fromJsFile)) {

        //        toJs.Write("/************************************\n");
        //        toJs.Write(" * ");
        //        toJs.Write(displayName);
        //        toJs.Write("\n ************************************/\n");

        //        toJs.Write(File.ReadAllText(fromJsFile, _encoding));

        //        toJs.Write('\n');

        //    }
        //}

        #endregion

    }
}
