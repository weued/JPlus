Console.Write("输入模块名(如form/textbox):  ");
var root = "../../";
var moduleName = Console.ReadLine().toLowerCase();

var mainModuleName = moduleName.split('/')[0];
var subModuleName = moduleName.split('/')[1];

if(!subModuleName) {
	Console.Write('缺少子模块');
	return;
}

var text = System.IO.File.ReadAllText(root + "_tools/tpl/index.html");
text = text.replace("\"assets/styles/index", "\"assets/styles/" + subModuleName).replace("\"assets/scripts/index", "\"assets/scripts/" + subModuleName);

System.IO.File.WriteAllText(root + moduleName + ".html", text);
System.IO.File.Copy(root + "_tools/tpl/assets/styles/index.css", root + mainModuleName + "/assets/styles/" + subModuleName + ".css");
System.IO.File.Copy(root + "_tools/tpl/assets/scripts/index.js", root + mainModuleName + "/assets/scripts/" + subModuleName + ".js");
Console.Write("完成");