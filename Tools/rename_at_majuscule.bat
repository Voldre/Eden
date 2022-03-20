@echo off
:: https://askcodez.com/renommer-tous-les-fichiers-dans-le-dossier-de-majuscules-avec-le-lot.html

setlocal enableDelayedExpansion

pushd C:\wamp\www\Site free.fr\Eden\images\char

for %%f in (*.png) do (
   set "filename=%%~f"

   for %%A in (A B C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
      set "filename=!filename:%%A=%%A!"
   )
    ren "%%f" "!filename!" >nul 2>&1
)

for /r "C:\wamp\www\Site free.fr\Eden\images\char\" %%G in (*.PNG) do ren "%%~G" *.png

endlocal