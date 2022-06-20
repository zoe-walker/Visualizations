var seriesData = require('./series-data.json');
var fs = require('fs');

var destPath = __dirname + '/mood-data.json'

var moodData = {
    data: {
        rootNode: {
            key: seriesData.name + '-key',
            name: seriesData.name
        },
        level1Relationship: [],
        level1LeafRelationship: [],
        level2Relationship: [],
        level2LeafRelationship: [],
        level3Relationship: [],
        level3LeafRelationship: [],
        level4Relationship: [],
        level4LeafRelationship: []
    }
}

function traverseChildren(level, parent, children, moodData, path) {
    const intermediateProperty = 'level' + level + 'Relationship'
    const leafProperty = 'level' + level + 'LeafRelationship'
    // console.log(intermediateProperty)
    // console.log(leafProperty)
    // if (level === 4) {
    //     console.log(JSON.stringify(moodData))
    // }


    children.forEach(function(child) {
        const grandChildren = child.children
        const key = path + '.' + child.name
        const node = {
            key: key,
            name: child.name
        }
        const link = {
            source: parent,
            target: node
        }
        if (grandChildren) {
            moodData[intermediateProperty].push(link)
            traverseChildren(level + 1, node, grandChildren, moodData, key)
        }
        else {
            node.value = child.value ? child.value : null
            moodData[leafProperty].push(link)
        }
    })
}

traverseChildren(1, moodData.data.rootNode, seriesData.children, moodData.data, seriesData.name)
//console.log(JSON.stringify(moodData, null, 2))
    
fs.writeFile(destPath, JSON.stringify(moodData, null, 2), function(err) {
    if (err) {
        return console.error(err);
    }
    console.log('Write ' + destPath)
});
