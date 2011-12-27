using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Text.RegularExpressions;

namespace Xuld.Tools.DplBuilder {
    class Program {

        static DplBuilder _builder = new DplBuilder();

        static void Main(string[] args) {

            Console.Title = "DPL 合成工具 v4";
            Console.Write("项目文件夹: ");
            _builder.WorkingDirectory = ReadOrArgs(args, 0) + "\\";
            Console.Write("目标 css 文件: ");
            _builder.ToCssFile = ReadOrArgs(args, 1);
            Console.Write("目标 js 文件: ");
            _builder.ToJsFile = ReadOrArgs(args, 2);
            Console.Write("目标 images 文件夹相对 css 文件的位置: ");
            _builder.ImageRelative = ReadOrArgs(args, 3) + "/";
            Console.WriteLine("要生成的名字空间: ");
            List<string> targets = new List<string>(10);

            if(args.Length > 4) {
                for(int i = 4; i < args.Length; i++) {
                    targets.Add(args[i]);
                }
            } else {
                string s;
                while(!String.IsNullOrEmpty(s = Console.ReadLine())){
                    targets.Add(s);
                }
            }

            _builder.BuildAll(targets);
        }

        static string ReadOrArgs(string[] args, int i) {
            if(args.Length > i){
                Console.WriteLine(args[i]);
                return args[i];
            }
            return Console.ReadLine();
        }


        
    }
}
