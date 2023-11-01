import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DoughnutChart = ({ data }) => {

  // Data for the Sex of Students
  const [sexeCounts, setSexeCounts] = useState({ male: 0, female: 0 });
  
  const width = 200;
  const height = 200;

  // Applying a Ref to the SVG to track it in the DOM
  const svgRef = useRef();

  // Colors that will represent the data
  const colors = ['#2986cc', '#8CC2F2'];
  const boxSize = 500;

  // Extracting "Sexe" attribute for each object
  const sexeData = data.map((element) => element.Sexe);

  // UseEffect to define what will happen when the page loads
  useEffect(() => {
    let male = 0;
    let female = 0;

    sexeData.forEach((element) => {
      if (element === 'M') {
        male += 1;
      } else if (element === 'F') {
        female += 1;
      }
    });

    const total = male + female;

    // Percentages for the Male and Female data to be displayed in the chart
    const malePercentage = (male / total) * 100;
    const femalePercentage = (female / total) * 100;

    setSexeCounts({ male, female });

    const values = [
      { value: male, label: 'Homme', percentage: malePercentage },
      { value: female, label: 'Femme', percentage: femalePercentage },
    ];

    // Removing the old svg
    d3.select(svgRef.current).select('svg').remove();

    // Creating new svg
    const svg = d3
      .select(svgRef.current)
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('height', height)
      .attr('width', width)
      .attr('viewBox', `0 0 ${boxSize} ${boxSize}`)
      .append('g')
      .attr('transform', `translate(${boxSize / 2}, ${boxSize / 2})`);

    const arcGenerator = d3.arc().padAngle(0.02).innerRadius(100).outerRadius(250);

    const pieGenerator = d3.pie().value((d) => d.value);

    const arcs = svg.selectAll().data(pieGenerator(values)).enter();
    arcs
      .append('path')
      .attr('d', arcGenerator)
      .style('fill', (d, i) => colors[i % data.length])
      .on('mouseover', function (event, d) {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(`${d.data.label}: ${d.data.value} (${d.data.percentage.toFixed(2)}%)`)
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function () {
        tooltip.transition().duration(500).style('opacity', 0);
      })
      .transition()
      .duration(700)
      .attrTween('d', function (d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return arcGenerator(d);
        };
      });

    // Labels
    arcs
      .append('text')
      .attr('transform', (d) => `translate(${arcGenerator.centroid(d)})`)
      .attr('dy', '-1em') // Adjust vertical positioning for sex name
      .style('font-size', '1.6rem') // Slightly smaller font size for sex name
      .style('font-weight', 'bold') // Increase font weight for sex name
      .style('fill', 'white')
      .style('text-anchor', 'middle')
      .text((d) => d.data.label);

    // Values for the chart
    const labelArc = d3.arc().innerRadius(110).outerRadius(250);
    arcs
      .append('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '0.35em')
      .style('font-size', '1.5rem')
      .style('fill', 'white')
      .style('text-anchor', 'middle')
      .text((d) => `${d.data.value}`);

    // Percentage for the chart
    arcs
      .append('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '1.7em')
      .style('font-size', '1.2rem')
      .style('fill', 'white')
      .style('text-anchor', 'middle')
      .text((d) => `(${d.data.percentage.toFixed(1)}%)`);

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

  }, [data, sexeCounts.male, sexeCounts.female]);

  return (
    <div className='flex flex-col bg-[white] px-5 pt-3 pb-4 drop-shadow-lg rounded-md'>
      <h1 className='mt-1 mb-4 font-bold'>Partition de Sexe</h1>
      <svg className='mx-auto' ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default DoughnutChart;
