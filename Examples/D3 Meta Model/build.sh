packageversion=`grep version package.json | sed -e s/^.*:// -e s/,$// -e s/\"//g -e s/[.]/-/g`
packagefilename=d3-meta-model-${packageversion}
zip ${packagefilename} package.json d3 Force\ Layout
