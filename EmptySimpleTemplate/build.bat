REM Package up all necessary files.

del visualisations.zip
powershell.exe Compress-Archive -Path Code -DestinationPath visualisations.zip
powershell.exe Compress-Archive -Update -Path package.json -DestinationPath visualisations.zip
