import * as d3 from "d3"
import { Icon } from "./Icon";

class IconGird {

    constructor(_config) {
        this.config = {
            parentElement: _config.parentElement,
            width: _config.width, 
            height: _config.height, 
            margin: _config.margin,
            colsN: _config.colsN, 
            rowsN: _config.rowsN, 
            scale: _config.scale,
            iconR: _config.iconR,
            background: _config.background,
            iconColors: _config.iconColors,
            iconsConfig: _config.iconsConfig,
            dataCategories: _config.dataCategories,
            data: _config.data
        }
        this.initVis();
    }

    initVis() {
        console.log("init vis")
        let vis = this;

        /**
         * Create SVG
         */
        vis.svg = d3.select(vis.config.parentElement).append("svg")
            .attr("width", vis.config.width)
            .attr("height", vis.config.height)
            .style('background-color', vis.config.background)

        /**
         * Create Icon Grid
         */
        vis.grid = vis.svg.append("g")
            .attr("transform", `translate(
                ${(vis.config.width - vis.config.margin.left - vis.config.margin.right)/(vis.config.colsN * 2)}, 
                ${(vis.config.height - vis.config.margin.top - vis.config.margin.bottom)/(vis.config.rowsN * 2) }
                )`);

        /**
         * Create Icon List
         */
        vis.icons = []
        vis.config.iconsConfig.forEach(c => {
            vis.icons.push(new Icon({
                id: c.id,
                parentElement: vis.grid,
                radius: c.radius,
                startAngle: c.startAngle,
                endAngle: c.endAngle,
                colors: vis.config.iconColors,
                scale: vis.config.scale,
                quarter: c.quarter.map(q => {
                    return {
                        translateX: q.translateX,
                        translateY: q.translateY,
                        roate: q.roate,
                        innerRadius: q.innerRadius || 0,
                        color: q.color
                    }
                })
            }))
        })
        
        /**
         * Create Scales
         */
        vis.y = d3.scaleBand()
        vis.x = d3.scaleBand()
        // Icon scale
        vis.i = d3.scaleOrdinal()

        vis.updateVis()
    }

    updateVis() {
        console.log("update vis IconGrid")
        let vis = this
        
        /**
         * Update SVG
         */
        vis.svg
            .attr("width", vis.config.width)
            .attr("height", vis.config.height)
            .style('background-color', vis.config.background)

        /**
         * Update Scales
         */

        vis.y
            .range([vis.config.margin.top, vis.config.height - vis.config.margin.bottom])
            .domain(d3.range(vis.config.rowsN));
        vis.x
            .range([vis.config.margin.left, vis.config.width - vis.config.margin.right])
            .domain(d3.range(vis.config.colsN));
        vis.i
            .range(d3.map(vis.icons, d => d.id))
            .domain(vis.config.dataCategories)

        /**
         * Add icons to grid
         */
        vis.grid.selectAll("use").remove();
        vis.grid.selectAll("use")
            .data(vis.config.data)
            .enter().append("use")
            .attr("xlink:href", d => `#${vis.i(d.type)}`)
            .attr("id", d => "id" + d.index)
            .attr('x', d => vis.x(d.index % vis.config.colsN))
            .attr('y', d => vis.y(Math.floor(d.index / vis.config.colsN)))
            .attr("transform", (d) => `rotate(${Math.floor(Math.random() * 4 + 1) * 90}, ${vis.x(d.index % vis.config.colsN)}, ${vis.y(Math.floor(d.index / vis.config.colsN))})`)
            .on('mouseover', function (event, d) {
                d3.select(this).transition()
                     .duration('50')
                     .attr('opacity', '.5')
                vis.grid.append("text")
                    .attr("x", vis.x(d.index % vis.config.colsN) - 3)
                    .attr("y", vis.y(Math.floor(d.index / vis.config.colsN)) - 3)
                    .attr("dy", "2em")
                    .attr("fill", "black")
                    .attr("font-size", 30)
                    .attr("font-weight", "700")
                    .attr("font-family", "sans-serif")
                    .text(d.type)

            })
            .on('mouseout', function (event, d) {
                d3.select(this).transition()
                     .duration('50')
                     .attr('opacity', '1')
                vis.grid.selectAll("text").remove()
            })
        
        } 

    renderVis() {
        console.log("render vis")
    }

} 

export { IconGird }