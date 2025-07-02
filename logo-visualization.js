// Define the dimensions
const WEFT_WIDTH = 75.0;  // inches (width of the film roll)
const NUMBER_CUTS = 100;   // The number of cuts to visualize
// const NUM_ROWS = 3;     // Number of rows of logos - now controlled by slider
// const SIDE_OFFSET = 5.0;  // inches (offset from each side in the weft direction)
// Cut lengths will now be controlled through the UI
let CUT_LENGTHS = [39.0, 36.0, 24.0];  // Initial cut lengths

// Define colors for the rows
const COLORS = ['darkblue', 'goldenrod','red', 'blue', 'green', 'cyan', 'magenta', 'yellow', 'orange', 'purple', 'brown', 'pink'];

// Wait for the DOM to be fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sliders
    const logoWidthSlider = document.getElementById('logoWidth');
    const logoHeightSlider = document.getElementById('logoHeight');
    const numRowsSlider = document.getElementById('numRows');
    const sideOffsetSlider = document.getElementById('sideOffset');
    const bufferSlider = document.getElementById('buffer');
    const multipleSlider = document.getElementById('multiple');
    const numRowsValue = document.getElementById('numRowsValue');
    const sideOffsetValue = document.getElementById('sideOffsetValue');

    // Initialize cut length inputs
    const cutLength1Input = document.getElementById('cutLength1');
    const cutLength2Input = document.getElementById('cutLength2');
    const cutLength3Input = document.getElementById('cutLength3');

    // Initialize display values
    const logoWidthValue = document.getElementById('logoWidthValue');
    const logoHeightValue = document.getElementById('logoHeightValue');
    const bufferValue = document.getElementById('bufferValue');
    const multipleValue = document.getElementById('multipleValue');

    // Update display values when sliders change
    logoWidthSlider.addEventListener('input', () => {
        logoWidthValue.textContent = parseFloat(logoWidthSlider.value).toFixed(2);
        updateVisualization();
    });

    logoHeightSlider.addEventListener('input', () => {
        logoHeightValue.textContent = parseFloat(logoHeightSlider.value).toFixed(2);
        updateVisualization();
    });

    numRowsSlider.addEventListener('input', () => {
        numRowsValue.textContent = numRowsSlider.value;
        updateVisualization();
    });

    sideOffsetSlider.addEventListener('input', () => {
        sideOffsetValue.textContent = parseFloat(sideOffsetSlider.value).toFixed(2);
        updateVisualization();
    });

    bufferSlider.addEventListener('input', () => {
        bufferValue.textContent = parseFloat(bufferSlider.value).toFixed(2);
        updateVisualization();
    });

    multipleSlider.addEventListener('input', () => {
        multipleValue.textContent = multipleSlider.value;
        updateVisualization();
    });

    function handleCutLengthChange() {
        const length1 = parseFloat(cutLength1Input.value);
        const length2 = parseFloat(cutLength2Input.value);
        const length3 = parseFloat(cutLength3Input.value);

        // Only update if all values are valid positive numbers.
        // This prevents errors and alerts while the user is typing.
        if (isNaN(length1) || isNaN(length2) || isNaN(length3) || length1 <= 0 || length2 <= 0 || length3 <= 0) {
            return;
        }

        CUT_LENGTHS = [length1, length2, length3];
        updateVisualization();
    }

    // Add event listeners to update visualization automatically on input change
    cutLength1Input.addEventListener('input', handleCutLengthChange);
    cutLength2Input.addEventListener('input', handleCutLengthChange);
    cutLength3Input.addEventListener('input', handleCutLengthChange);

    // Function to update the visualization
    function updateVisualization() {
        // Get current values from sliders
        const logoWidth = parseFloat(logoWidthSlider.value);
        const logoHeight = parseFloat(logoHeightSlider.value);
        const NUM_ROWS = parseInt(numRowsSlider.value);
        const SIDE_OFFSET = parseFloat(sideOffsetSlider.value);
        const buffer = parseFloat(bufferSlider.value);
        const multiple = parseInt(multipleSlider.value);
        
        // Calculate logoOffset and logoSpacingWarp dynamically
   
        const logoSpacingWarp = CUT_LENGTHS[0] / multiple - logoHeight;
        // const logoOffset = CUT_LENGTHS[0] - buffer - multiple * (logoHeight + logoSpacingWarp);
        // const logoOffset = logoHeight -buffer;
        const logoOffset = CUT_LENGTHS[0] - buffer - multiple * (logoHeight )- logoSpacingWarp;

        console.log("Updating visualization with cut lengths:", CUT_LENGTHS);

        // Clear previous visualization
        const container = document.getElementById('visualization-container');
        container.innerHTML = '';

        // Calculate the total warp length
        const TOTAL_WARP_LENGTH = Math.ceil(NUMBER_CUTS * CUT_LENGTHS[0]);

        // Calculate the first offset for each row in the warp direction
        const initialOffset = 0;
        const firstOffsetWarp = Array.from({ length: NUM_ROWS }, (_, i) => initialOffset + i * logoOffset);

        // Calculate the spacing between logos in the weft direction
        const spacingWeft = NUM_ROWS > 1 
            ? (WEFT_WIDTH - 2 * SIDE_OFFSET - NUM_ROWS * logoWidth) / (NUM_ROWS - 1)
            : 0;

        // Define the boundaries for each row in the weft direction
        const rowStarts = Array.from({ length: NUM_ROWS }, (_, i) => 
            SIDE_OFFSET + i * (logoWidth + spacingWeft));

        // Create a visualization for each cut length
        CUT_LENGTHS.forEach((cutLength, index) => {
            // Create a div for this visualization
            const vizDiv = document.createElement('div');
            vizDiv.style.position = 'relative';
            vizDiv.style.display = 'flex';
            vizDiv.style.flexDirection = 'column';
            vizDiv.style.alignItems = 'center';
            container.appendChild(vizDiv);
            
            // Add a title above the SVG
            const titleDiv = document.createElement('h3');
            titleDiv.textContent = `Cut Length: ${cutLength.toFixed(1)}in`;
            titleDiv.style.margin = '0 0 10px 0';
            titleDiv.style.textAlign = 'center';
            titleDiv.className = 'cut-length-title';
            vizDiv.appendChild(titleDiv);

            // Create a wrapper for the SVG and labels
            const wrapperDiv = document.createElement('div');
            wrapperDiv.style.display = 'flex';
            wrapperDiv.style.flexDirection = 'row';
            wrapperDiv.style.alignItems = 'center';
            vizDiv.appendChild(wrapperDiv);
            
            // Add Y-axis (Warp Direction) label
            const yAxisLabel = document.createElement('div');
            yAxisLabel.textContent = 'Warp Direction (inches)';
            yAxisLabel.style.transform = 'rotate(-90deg)';
            yAxisLabel.style.marginRight = '-100px'; // Reduced from -40px
            yAxisLabel.style.fontSize = '14px';
            yAxisLabel.style.whiteSpace = 'nowrap';
            wrapperDiv.appendChild(yAxisLabel);
            
            // Create a div for the SVG
            const svgDiv = document.createElement('div');
            svgDiv.style.display = 'flex';
            svgDiv.style.flexDirection = 'column';
            wrapperDiv.appendChild(svgDiv);
            
            // Create the SVG
            const svg = d3.select(svgDiv)
                .append('svg')
                .attr('width', WEFT_WIDTH * 6) 
                .attr('height', TOTAL_WARP_LENGTH * 6)
                .attr('viewBox', `0 0 ${WEFT_WIDTH} ${TOTAL_WARP_LENGTH}`)
                .attr('style', 'border: 1px solid #ccc;');
                
            // Add X-axis (Weft Direction) label
            const xAxisLabel = document.createElement('div');
            xAxisLabel.textContent = 'Weft Direction (inches)';
            xAxisLabel.style.marginTop = '5px'; // Reduced from 10px
            xAxisLabel.style.fontSize = '14px';
            xAxisLabel.style.textAlign = 'center';
            svgDiv.appendChild(xAxisLabel);
            
            // Add grid lines
            svg.append('g')
                .attr('class', 'grid')
                .selectAll('line.vertical')
                .data(d3.range(0, WEFT_WIDTH, 5))
                .enter()
                .append('line')
                .attr('x1', d => d)
                .attr('y1', 0)
                .attr('x2', d => d)
                .attr('y2', TOTAL_WARP_LENGTH)
                .attr('stroke', '#eee')
                .attr('stroke-width', '0.1');

            svg.append('g')
                .attr('class', 'grid')
                .selectAll('line.horizontal')
                .data(d3.range(0, TOTAL_WARP_LENGTH, 5))
                .enter()
                .append('line')
                .attr('x1', 0)
                .attr('y1', d => d)
                .attr('x2', WEFT_WIDTH)
                .attr('y2', d => d)
                .attr('stroke', '#eee')
                .attr('stroke-width', '0.1');

            // Add vertical guide lines for the 24OC and 16OC visualizations
            if (index === 1 || index === 2) {
                const guideLines = [13.5, 61.5];
                guideLines.forEach(xPos => {
                    // Draw the line
                    svg.append('line')
                        .attr('x1', xPos)
                        .attr('y1', 0)
                        .attr('x2', xPos)
                        .attr('y2', TOTAL_WARP_LENGTH)
                        .attr('stroke', 'purple')
                        .attr('stroke-width', '0.2')
                        .attr('stroke-dasharray', '1,1');

                    // Add the label
                    svg.append('text')
                        .attr('transform', `translate(${xPos - 0.5}, 15) rotate(-90)`)
                        .attr('font-size', '2.5px')
                        .attr('font-weight', 'italic')
                        .attr('fill', 'purple')
                        .text('Batt End');
                });
            }

            // Plot logos for each row, repeating in the warp direction
            for (let warpPosition = 0; warpPosition < TOTAL_WARP_LENGTH; warpPosition += logoSpacingWarp + logoHeight) {
                for (let row = 0; row < NUM_ROWS; row++) {
                    const color = COLORS[row % COLORS.length];
                    
                    // Create rectangles representing the logos
                    svg.append('rect')
                        .attr('x', rowStarts[row])
                        .attr('y', warpPosition + firstOffsetWarp[row])
                        .attr('width', logoWidth)
                        .attr('height', logoHeight)
                        .attr('fill', color)
                        .attr('stroke', 'black')
                        .attr('stroke-width', '0.1');
                }
            }

            // Add cut lines
            for (let i = 0; i < NUMBER_CUTS; i++) {
                const cutPosition = i * cutLength;
                
                // Add a horizontal line to represent the cut
                svg.append('line')
                    .attr('x1', 0)
                    .attr('y1', cutPosition)
                    .attr('x2', WEFT_WIDTH)
                    .attr('y2', cutPosition)
                    .attr('stroke', 'black')
                    .attr('stroke-width', '0.2')
                    .attr('stroke-dasharray', '0.5');
                
                // Add label for the cut
                svg.append('text')
                    .attr('x', WEFT_WIDTH - 2)
                    .attr('y', cutPosition + 2.5)  // Increased the offset from +1 to +2.5
                    .attr('text-anchor', 'end')
                    .attr('font-size', '2.5px')
                    .attr('font-weight', 'italic')
                    .text(`Cut ${i + 1}`);
            }
        });
    }

    // Initialize visualization
    updateVisualization();
});
