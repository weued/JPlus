@echo off
cd ../../_tools/dotless/
::dotless.Compiler.exe ../../core/assets/styles/bootstrap/bootstrap.less ../../core/assets/styles/bootstrap.css


dotless.Compiler.exe ../../button/assets/styles/button.less 
dotless.Compiler.exe ../../page/assets/styles/grid.less 



pause