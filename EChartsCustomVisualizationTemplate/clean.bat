REM Cleans all auto-generated files.

rd /q /s dist
rd /q /s node_modules
rd /q /s .vs

del src\package.json
del src\package.json.ejs
del src\visualization01\visualization.config.json
del src\visualization01\visualization.config.json.ejs
del visualizations.zip
