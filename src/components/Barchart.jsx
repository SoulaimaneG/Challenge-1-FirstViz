import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Barchart = ({ data }) => {

  // Applying a Ref to the SVG to track it in the DOM
  const svgRef = useRef();
  
  const divRef = useRef();

  // Extracting "Electricite", "Eau", "PC" and "Livres" attribute for each object from the "data" variable
  const studentData = data.map((element) => ({
    "Electricite": element.Electricite,
    "Eau": element.Eau,
    "PC": element.PC,
    "Livres": element.Livres
  }));

  // Getting the count of each attribute to be used in the chart
  const counts = {
    "Electricite": studentData.filter((d) => d.Electricite === 'Oui').length,
    "Eau": studentData.filter((d) => d.Eau === 'Oui').length,
    "PC": studentData.filter((d) => d.PC === 'Oui').length,
    "Livres": studentData.filter((d) => d.Livres === 'Oui').length,
  };

  const margin = { top: 20, right: 20, bottom: 50, left: 50 }; // Increased bottom margin for axis labels

  const containerWidth = divRef.current ? divRef.current.clientWidth : 400;
  const containerHeight = 250;

  const width = containerWidth - margin.left - margin.right;
  const height = containerHeight - margin.top - margin.bottom;

  // UseEffect to define what will happen when the page loads
  useEffect(() => {
    // Removing old svg
    d3.select(svgRef.current).selectAll('*').remove();

    // Creating svg
    const svg = d3
      .select(svgRef.current)
      .append('svg')
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Creating scales
    const xScale = d3
      .scaleBand()
      .domain(Object.keys(counts))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(Object.values(counts))])
      .range([height, 0]);

    // Creating Bars
    const bars = svg
      .selectAll('rect')
      .data(Object.entries(counts))
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d[0]))
      .attr('y', (d) => yScale(d[1]))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d[1]))
      .attr('fill', '#2986cc')
      .on('mouseover', (event, d) => {
        const [category, count] = d;
        d3.select('#tooltip')
          .style('opacity', 0.9)
          .html(`<strong>${category}</strong>: ${count} students`)
          .style('left', event.pageX + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', () => {
        d3.select('#tooltip').style('opacity', 0);
      });

    bars
      .transition()
      .duration(1000)
      .attr('y', (d) => yScale(d[1]))
      .attr('height', (d) => height - yScale(d[1]));

    // Creating Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g').attr('transform', `translate(0,${height})`).call(xAxis);
    svg.append('g').call(yAxis);

    // Showing Labels
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${width / 2},${height + margin.top + 20})`)
      .text('Catégories');

    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .text("Nombre d'étudiants");

    d3.select('body').append('div').attr('id', 'tooltip').style('opacity', 0);
  }, [counts, containerWidth, containerHeight]);

  return (
    <div className='bg-[white] px-5 pt-4 pb-4 drop-shadow-lg rounded-md'>
      <h1 className='mt-1 font-bold'>Nb étudiants par Catégorie</h1>
      <div ref={divRef} className='mx-auto'>
        <svg className='mx-auto' ref={svgRef} width={containerWidth} height={containerHeight}></svg>
      </div>
    </div>
  );
};

export default Barchart;
