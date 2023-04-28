import * as d3 from "d3"
import GUI from "lil-gui"
import { IconGird } from "./IconGrid"
import * as svg from 'save-svg-as-png';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 *  ICON GRID CONFIG
 */
const gridConfig = {}
gridConfig.parentElement = "#grid-container"
gridConfig.width = 300
gridConfig.height = 900
gridConfig.iconR = 15
gridConfig.colsN = 7
gridConfig.scale = 1
gridConfig.background = '#1B1818'
gridConfig.iconColors = ['#AC5CEA','#62bde4', '#ffffff', '#FFE184', '#00A09A']

let iconGrid

/**  
 * DATA - TODO: load data from csv
*/

d3.csv('tickets.csv').then(data => {
    console.log(0x1B1818.toString(16))
    let gridData = []
    data.forEach(d => {
        d.type = d.type;
        d.count = parseInt(d.count);
        for (let i = 0; i < d.count; i++){
            gridData.push({type: d.type})
        }
    })
    gridData = d3.shuffle(gridData)
    gridData.forEach((d, i) => d.index = i)

    console.log(gridData)

    gridConfig.data = gridData
    gridConfig.rowsN = Math.ceil(gridConfig.data.length / gridConfig.colsN)

    iconGrid = new IconGird(gridConfig)
    addConfigurationMenu()
})

/**
 * CONFIGURATION
 */
function addConfigurationMenu() {


    // Configuration GUI
    const gui = new GUI();

    gui.add( gridConfig, 'width', 0, 1200, 1)
        .name("Width")
        .onChange( value => {
            iconGrid.config.width = value
            iconGrid.updateVis()
        })

    gui.add( gridConfig, 'height', 0, 1200, 1)
        .name("Height")
        .onChange( value => {
            iconGrid.config.height = value
            iconGrid.updateVis()
        })

    gui.add( gridConfig, 'colsN', 0, 50, 1)
        .name("Columns")
        .onChange( value => {
            iconGrid.config.colsN = value
            iconGrid.updateVis()
        })
        
    gui.add( gridConfig, 'rowsN', 0, 50, 1)
        .name("Rows")
        .onChange( value => {
            iconGrid.config.rowsN = value
            iconGrid.updateVis()
        })

    gui.add( gridConfig, 'scale', 0, 5)
        .name("Icon Scale")
        .onChange( value => {
            iconGrid.config.iconR = value
            iconGrid.icons.forEach(i => {
                i.scale = value
                i.updateVis()
            })
            iconGrid.updateVis()
        })

    const colorFormats = {
        background: gridConfig.background
    };

    gui.addColor( colorFormats, 'background' )
        .name("Background")
        .onChange( value => {
            iconGrid.config.background = value
            iconGrid.updateVis()
        })
    
    gridConfig.iconColors.forEach((c, i) => {
        const colorFormats = {
            background: c
        };
    
        gui.addColor( colorFormats, 'background' )
            .name("Icon Color " + String(i + 1))
            .onChange( value => {
                iconGrid.config.iconColors[i] = value
                iconGrid.icons.forEach(icon => {
                    icon.colors[i]
                    icon.updateVis()
                })
            })
        
    })

    let obj = {
        download: download
    }

    gui.add( obj, 'download' )
        .name("Download")

}
function download() {

    let timestamp = new Date().toLocaleDateString('en-EN', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'})

    downloadAsCSV(timestamp)
    downloadAsPng(timestamp)
    downloadSettingsAsCsv(timestamp)

}

function downloadSettingsAsCsv(timestamp) {

    // Prepare data download
    let csvContentData = "data:text/csv;charset=utf-8," 
    + "type,index" + "\n" // Add header line
    + gridConfig.data.map(e => e.type + "," + e.index).join("\n") // Add line for each data entry

    // Prepare config download
    let configList = []
    Object.keys(gridConfig).forEach(k => {
        if (k !== 'data') {
            // Remove # from the strings or the CSV creation will bread
            configList.push({[k]: gridConfig[k].toString().replaceAll("#", "")})
        }
    })

    let csvContentConfig = "data:text/csv;charset=utf-8;" 
        + "key,value" + "\n" // Add header lines
        + configList.map(e => Object.entries(e)[0].join(",")).join("\n") // Add line for each data entry

    let downloadList = [
        {data: csvContentData, filename: `data_illustration_${timestamp}.csv`}, 
        {data: csvContentConfig, filename: `data_illustration_config_${timestamp}.csv`}
    ]

    // Download both data files
    downloadList.forEach(d => {

        let encodedUri = encodeURI(d.data)
        let link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", d.filename)
    
        document.body.appendChild(link) // Required for FF
    
        link.click() // This will download the data file

        document.body.removeChild(link) 

    })  
}

function downloadAsPng(timestamp) {

    // Download SVG as PNG
    svg.saveSvgAsPng(document.getElementsByTagName("svg")[0], `data_illustration_${timestamp}.png`)

}

function downloadAsCSV(timestamp) {

    // Download SVG
    //get svg element.
    var svg = document.getElementsByTagName("svg")[0];

    //get svg source.
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svg);

    //add name spaces.
    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    //convert svg source to URI data scheme.
    var encodedUri = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
    let link = document.createElement("a")

    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `data_illustration_${timestamp}.svg`)

    document.body.appendChild(link) // Required for FF

    link.click() // This will download the data file

    document.body.removeChild(link) 


}