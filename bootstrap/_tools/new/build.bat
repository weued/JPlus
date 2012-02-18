@echo off
cd ../../_tools/dotless/
::dotless.Compiler.exe ../../core/assets/styles/bootstrap/bootstrap.less ../../core/assets/styles/bootstrap.css


dotless.Compiler.exe ../../page/assets/styles/typography.less 
dotless.Compiler.exe ../../page/assets/styles/scaffolding.less 
dotless.Compiler.exe ../../page/assets/styles/grid.less 
dotless.Compiler.exe ../../page/assets/styles/grid-fluid.less 
dotless.Compiler.exe ../../page/assets/styles/grid-fixed.less 
dotless.Compiler.exe ../../button/assets/styles/button.less 



pause