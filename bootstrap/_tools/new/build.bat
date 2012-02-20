@echo off
cd ../../_tools/dotless/

dotless.Compiler.exe ../../button/assets/styles/menu.less 
dotless.Compiler.exe ../../button/assets/styles/menubutton.less 
dotless.Compiler.exe ../../button/assets/styles/buttongroup.less 
dotless.Compiler.exe ../../display/assets/styles/icon.less 
dotless.Compiler.exe ../../dataview/assets/styles/table.less 
dotless.Compiler.exe ../../form/assets/styles/form.less 
dotless.Compiler.exe ../../form/assets/styles/textbox.less 
dotless.Compiler.exe ../../page/assets/styles/common.less 

dotless.Compiler.exe ../../core/assets/styles/base.less
dotless.Compiler.exe ../../page/assets/styles/grid.less 
dotless.Compiler.exe ../../page/assets/styles/grid-fluid.less 
dotless.Compiler.exe ../../page/assets/styles/grid-fixed.less 
dotless.Compiler.exe ../../button/assets/styles/button.less 



pause