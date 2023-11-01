import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const RadarChart = ({ data }) => {

  const width = 500;
  const height = 400;

  // Labels
  const labels = ['SP', 'SC', 'SA', 'SM', 'SLA', 'SPL'];

  // Extracting students Performances "SP", "SC", "SA", "SM", "SLA" and "SPL" for each object from the "data" variable
  const studentData = data.map((element) => {
    const parsedData = {};
    labels.forEach((label) => {
      if (element[label]) {
        parsedData[label] = parseFloat(element[label].replace(' �', '').replace(',', '.'));
      } else {
        parsedData[label] = 0;
      }
    });
    return parsedData;
  });

  const [selectedStudent1, setSelectedStudent1] = useState(studentData[0] || {});
  const [selectedStudent2, setSelectedStudent2] = useState(studentData[1] || {});

  // Applying a Ref to the SVG to track it in the DOM
  const svgRef = useRef(null);

  // UseEffect to define what will happen when the page loads
  useEffect(() => {
    if (!svgRef.current) return;

    // Clearing charts by removing old SVGs
    d3.select(svgRef.current).selectAll('*').remove();

    // Creating svg
    const svg = d3
      .select(svgRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Number of data points
    const numDataPoints = labels.length;

    // Converting data to coordinates
    const valueToCoordinates = (value, label) => {
      const index = labels.indexOf(label);
      const angle = (index * 2 * Math.PI) / labels.length;
      const radius = (value / 20) * (Math.min(width, height) / 2);
      return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
    };

    // Creating circles for the data points
    for (let i = 1; i <= 5; i++) {
      svg
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', (Math.min(width, height) / 2) * (i / 5))
        .attr('fill', 'none')
        .attr('stroke', '#555') // Change color to a different one
        .attr('stroke-width', 0.8) // Increase stroke width for better visibility
        .attr('stroke-dasharray', '4 4'); // Improved dash array
    }

    // Showing the Radar circles for the range
    const path = d3
      .line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveLinearClosed);

    [selectedStudent1, selectedStudent2].forEach((student, studentIndex) => {
      svg
        .append('path')
        .datum(labels.map((label) => valueToCoordinates(student[label], label)))
        .attr('d', path)
        .attr('fill', studentIndex === 0 ? 'lightgreen' : 'lightblue') // Update colors here
        .attr('stroke', studentIndex === 0 ? 'darkgreen' : 'darkblue') // Update colors here
        .attr('opacity', 0.7);

      // Showing Data points
      labels.forEach((label, index) => {
        const { x, y } = valueToCoordinates(student[label], label);

        const tooltip = `${label}: ${student[label]}`;
        svg
          .append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 6)
          .attr('fill', studentIndex === 0 ? 'green' : 'blue') // Update colors here
          .attr('opacity', 0.8)
          .on('mouseover', function () {
            d3.select(this).attr('r', 8); // Increase size on hover
          })
          .on('mouseout', function () {
            d3.select(this).attr('r', 6); // Restore size on mouseout
          })
          .append('title')
          .text(tooltip);
      });
    });

    // Y-axis values
    const yAxisValues = [0, 5, 10, 15, 20]; // Adjusted values

    // Showing the Y-axis Values in the chart
    yAxisValues.forEach(value => {
      const scaledValue = (value / 20) * ((Math.min(width, height) / 2) * (5 / 5));
      svg
        .append('text')
        .attr('x', 0)
        .attr('y', -scaledValue)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text(value);
    });

  }, [selectedStudent1, selectedStudent2, labels]);

  return (
    <div className="bg-[white] px-5 py-3 drop-shadow-lg rounded-md">
      <h1 className="mt-1 mb-[20px] font-bold">Comparaison des Performances</h1>
      <div className='flex flex-row gap-3 mb-[20px] justify-end'>
      <div className="mb-4">
        <select className='rounded px-2 py-1 bg-[#F0F1F3]' id="student1" onChange={(e) => setSelectedStudent1(studentData[e.target.value])}>
          {studentData.slice(0, 40).map((student, index) => (
            <option key={index} value={index}>
              Student {index + 1}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select className='rounded px-2 py-1 bg-[#F0F1F3]' id="student2" onChange={(e) => setSelectedStudent2(studentData[e.target.value])}>
          {studentData.slice(0, 40).map((student, index) => (
            <option key={index} value={index}>
              Student {index + 1}
            </option>
          ))}
        </select>
      </div>
      </div>
      <svg className='mx-auto' ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default RadarChart;
