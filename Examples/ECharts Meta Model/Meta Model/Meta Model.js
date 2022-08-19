
var createMetaModel = function(_config, css){

    config = _config

    // Monkey patch Math.Random so we always get the same graph.
    seedRandom(42)

    var convertedData = {
        nodes: [],
        edges: [],
        categories: ['Types', 'Relationships']
    }

    createNodesFromMooDData(config.data.meta, convertedData.nodes)
    createEdgesFromMooDData(config.data.meta, convertedData.edges)

    // Remove edges where the source/target no longer exists.
    convertedData.edges = convertedData.edges.filter(e=> undefined!==convertedData.nodes.find(n=>n.id===e.source) &&
                                                         undefined!==convertedData.nodes.find(n=>n.id===e.target) )

    var chartDom = document.getElementById(config.element)
    var myChart = echarts.init(chartDom, null/*, { renderer: 'canvas' }*/)
    //
    // Configure a "graph" type chart with "force" layout.
    // See documentation https://echarts.apache.org/en/option.html#series-graph.layout
    //
    var option = {
        color: [config.style["Node Colour"], config.style["Relationship Colour"], '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
        tooltip: {},
        animation: config.animation,// animationDelay: 0, animationDuration:0,
        /*legend: [
            {
                show: true,
                data: convertedData.categories
            }
        ],*/
        series: [
            {
                name: 'Meta Model',
                type: 'graph',
                layout: 'force',
                data: convertedData.nodes,
                links: convertedData.edges,
                categories: convertedData.categories,
                roam: true,
                force: { repulsion: 500, layoutAnimation: false },
                label: {
                    show: true,
                    //position: 'right',
                    //formatter: '{b}'
                },

                // Decided to keep all the labels.
                //labelLayout: { hideOverlap: true },

                scaleLimit: { min: 0.3, max: 5 }, // Limit the zoom in/out range.
                // Decided against edge labels in favour of relationship nodes.
                //edgeLabel: { fontSize: 8, show: true, formatter: param => param.data.label },
                lineStyle: {
                    //label: { show: true, formatter: 'asdfasdf' },
                    //color: 'source',
                    curveness: 0.1
                }
            }
        ]
    }

    myChart.setOption(option)

    myChart.on('finished', function () {
        //snapshotImage.src = chart.getDataURL()
        //alert('here')
        console.log('done!')
    })

    if(config.animation===false){
        /*function sleep(seconds)
        {
          var e = new Date().getTime() + (seconds * 1000)
          while (new Date().getTime() <= e) {}
        }

        sleep(1);*/
    }
}

var createNodesFromMooDData = function(meta, convertedNodes){
    for(var i=0;i<meta.aliases.length;i++){
        var d = meta.aliases[i]

        // The ability to remove nodes
        if(config.style["Ignore Nodes"].find(x=>x==d.name) || config.style["Ignore Nodes"].find(x=>x==d.id)){
            continue
        }

        if(d.type==="element relationship"){
            d.symbolSize = 25
            d.category = 1
        } else {
            d.category = 0
            d.symbolSize = 50
            d.symbol = 'rectangle'
        }

        convertedNodes.push(d)
    }
}

var createEdgesFromMooDData = function(meta, convertedData){

    for(var i=0;i<meta.aliases.length;i++){
        var alias = meta.aliases[i]

        // Add in links from relationships to their targets.
        if(alias.allowed_aliases!==undefined)
        {
            for(var a=0;a<alias.allowed_aliases.length;a++){
                var targetAlias = alias.allowed_aliases[a]
                convertedData.push({source: alias.id, target: targetAlias.id})
            }
        }

        // Add in links from an alias to the relationship alias.
        if(alias.fields!==undefined){
            for(var j=0;j<alias.fields.length;j++) {
                var field = alias.fields[j]
                if(field.relationship_alias_id!==null){
                    convertedData.push({source: alias.id, target: field.relationship_alias_id})
                }
            }
        }
    }
}

var seedRandom = function(i){
    var m_w = 123456789
    var m_z = 987654321
    var mask = 0xffffffff

    m_w = (123456789 + i) & mask
    m_z = (987654321 - i) & mask

    Math.random = function(){
        // Returns number between 0 (inclusive) and 1.0 (exclusive), just like Math.random().
        m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask
        m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask
        var result = ((m_z << 16) + (m_w & 65535)) >>> 0
        result /= 4294967296
        return result
    }
}
