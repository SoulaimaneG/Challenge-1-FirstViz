import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const PieChart = ({ data }) => {

  // Data for "Secteur"
  const [secteurCounts, setSecteurCounts] = useState(
    { Public: 0, Prive: 0 }
  );
  
  const width = 200;
  const height = 200;

  // Applying a Ref to the SVG to track it in the DOM
  const svgRef = useRef();

  // Colors that will represent the data
  const colors = ['#2986cc', '#8CC2F2'];
  const boxSize = 500;

  // Extracting "Secteur" attribute for each object
  const secteurData = data.map((element) => element.Secteur);

  // UseEffect to define what will happen when the page loads
  useEffect(() => {
    let Public = 0;
    let Prive = 0;

    secteurData.forEach((element) => {
      if (element === 'Public') {
        Public += 1;
      } else if (element === 'Prive') {
        Prive += 1;
      }
    });

    setSecteurCounts({ Public, Prive });

    const total = Public + Prive;

    // Percentages for the Public and Private data to be displayed in the chart
    const publicPercentage = (Public / total) * 100;
    const privePercentage = (Prive / total) * 100;

    const values = [
      { value: Public, label: 'Public', percentage: publicPercentage },
      { value: Prive, label: 'Prive', percentage: privePercentage },
    ].filter((segment) => segment.value !== 0);

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

    const arcGenerator = d3.arc().padAngle(0.02).innerRadius(0).outerRadius(250);

    const pieGenerator = d3.pie().value((d) => d.value);

    const arcs = svg.selectAll().data(pieGenerator(values)).enter();
    arcs
      .append('path')
      .attr('d', arcGenerator)
      .style('fill', (d, i) => colors[i % data.length])
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
    const labelArc = d3.arc().innerRadius(110).outerRadius(250);
    arcs
      .append('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '-0.7em')
      .style('font-size', '1.8rem')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .style('text-anchor', 'middle')
      .text((d) => d.data.label);

    // Values for the chart
    arcs
      .append('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '0.35em')
      .style('font-size', '1.5rem')
      .style('fill', 'white')
      .style('text-anchor', 'middle')
      .text((d) => `${d.data.value}`);

    // Percentages for the chart
    arcs
      .append('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '1.7em')
      .style('font-size', '1.2rem')
      .style('fill', 'white')
      .style('text-anchor', 'middle')
      .text((d) => `(${d.data.percentage.toFixed(1)}%)`);
  }, [data, secteurCounts.Public, secteurCounts.Prive]);

  return (
    <div className='flex flex-col bg-[white] px-5 pt-4 pb-3 drop-shadow-lg rounded-md'>
      <h1 className='mt-1 mb-4 font-bold'>Partition de Secteur</h1>
      <svg className='mx-auto' ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default PieChart;
