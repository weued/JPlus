@echo off

::Core
"../../assets/tools/dotless/dotless.Compiler.exe" ../core/assets/styles/base.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../core/assets/styles/common.less

::Display
"../../assets/tools/dotless/dotless.Compiler.exe" ../display/assets/styles/arrow.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../display/assets/styles/thumbnail.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../display/assets/styles/arrow.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../display/assets/styles/icon.less 
"../../assets/tools/dotless/dotless.Compiler.exe" ../display/assets/styles/list.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../display/assets/styles/label.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../display/assets/styles/arrow.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../display/assets/styles/tip.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../display/assets/styles/tipbox.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../display/assets/styles/progressbar.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../display/assets/styles/bubble.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../display/assets/styles/tooltip.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../display/assets/styles/balloontip.less

:: Form
::"../../assets/tools/dotless/dotless.Compiler.exe" ../form/assets/styles/form.less
:: ::"../../assets/tools/dotless/dotless.Compiler.exe" ../form/assets/styles/iformcontrol.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../form/assets/styles/textbox.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../form/assets/styles/select.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../form/assets/styles/checkbox.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../form/assets/styles/radiobutton.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../form/assets/styles/searchtextbox.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../form/assets/styles/listbox.less
::"../../assets/tools/dotless/dotless.Compiler.exe" ../form/assets/styles/suggest.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../form/assets/styles/.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../form/assets/styles/.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../form/assets/styles/.less

:: Button
"../../assets/tools/dotless/dotless.Compiler.exe" ../button/assets/styles/button.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../button/assets/styles/buttongroup.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../button/assets/styles/menubutton.less
"../../assets/tools/dotless/dotless.Compiler.exe" ../button/assets/styles/splitbutton.less

:: Container
"../../assets/tools/dotless/dotless.Compiler.exe" ../container/assets/styles/tabbable.less

:: DataView
"../../assets/tools/dotless/dotless.Compiler.exe" ../dataview/assets/styles/table.less



pause