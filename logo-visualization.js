// Define the dimensions
const WEFT_WIDTH = 48;  // inches (width of the film roll)
const NUM_ROWS = 3;     // Number of rows of logos
const SIDE_OFFSET = 5;  // inches (offset from each side in the weft direction)
// Cut lengths will now be controlled through the UI
let CUT_LENGTHS = [39, 36, 24];  // Initial cut lengths

// Define colors for the rows
const COLORS = ['red', 'blue', 'green', 'cyan', 'magenta', 'yellow', 'orange', 'purple', 'brown', 'pink'];

// Wait for the DOM to be fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sliders
    const logoWidthSlider = document.getElementById('logoWidth');
    const logoHeightSlider = document.getElementById('logoHeight');
    const logoSpacingWarpSlider = document.getElementById('logoSpacingWarp');
    const logoOffsetSlider = document.getElementById('logoOffset');
    const numberCutsSlider = document.getElementById('numberCuts');

    // Initialize cut length inputs
    const cutLength1Input = document.getElementById('cutLength1');
    const cutLength2Input = document.getElementById('cutLength2');
    const cutLength3Input = document.getElementById('cutLength3');
    const updateCutLengthsButton = document.getElementById('updateCutLengths');

    // Initialize display values
    const logoWidthValue = document.getElementById('logoWidthValue');
    const logoHeightValue = document.getElementById('logoHeightValue');
    const logoSpacingWarpValue = document.getElementById('logoSpacingWarpValue');
    const logoOffsetValue = document.getElementById('logoOffsetValue');
    const numberCutsValue = document.getElementById('numberCutsValue');

    // Update display values when sliders change
    logoWidthSlider.addEventListener('input', () => {
        logoWidthValue.textContent = logoWidthSlider.value;
        updateVisualization();
    });

    logoHeightSlider.addEventListener('input', () => {
        logoHeightValue.textContent = logoHeightSlider.value;
        updateVisualization();
    });

    logoSpacingWarpSlider.addEventListener('input', () => {
        logoSpacingWarpValue.textContent = logoSpacingWarpSlider.value;
        updateVisualization();
    });

    logoOffsetSlider.addEventListener('input', () => {
        logoOffsetValue.textContent = logoOffsetSlider.value;
        updateVisualization();
    });

    numberCutsSlider.addEventListener('input', () => {
        numberCutsValue.textContent = numberCutsSlider.value;
        updateVisualization();
    });

    // Update cut lengths when button is clicked
    updateCutLengthsButton.addEventListener('click', () => {
        // Get values from inputs and convert to numbers
        const length1 = parseFloat(cutLength1Input.value);
        const length2 = parseFloat(cutLength2Input.value);
        const length3 = parseFloat(cutLength3Input.value);
        
        // Validate inputs
        if (isNaN(length1) || isNaN(length2) || isNaN(length3) || 
            length1 <= 0 || length2 <= 0 || length3 <= 0) {
            alert("Please enter valid positive numbers for all cut lengths.");
            return;
        }
        
        // Update the cut lengths array
        CUT_LENGTHS = [length1, length2, length3];
        console.log("Cut lengths updated to:", CUT_LENGTHS);
        
        // Update the visualization
        updateVisualization();
    });

    // Function to update the visualization
    function updateVisualization() {
        // Get current values from sliders
        const logoWidth = parseInt(logoWidthSlider.value);
        const logoHeight = parseInt(logoHeightSlider.value);
        const logoSpacingWarp = parseInt(logoSpacingWarpSlider.value);
        const logoOffset = parseInt(logoOffsetSlider.value);
        const numberCuts = parseInt(numberCutsSlider.value);
        
        console.log("Updating visualization with cut lengths:", CUT_LENGTHS);

        // Clear previous visualization
        const container = document.getElementById('visualization-container');
        container.innerHTML = '';

        // Calculate the total warp length
        const TOTAL_WARP_LENGTH = Math.ceil(numberCuts * CUT_LENGTHS[0]);

        // Calculate the first offset for each row in the warp direction
        const initialOffset = 1;
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
            titleDiv.textContent = `Cut Length: ${cutLength}in`;
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
            yAxisLabel.style.marginRight = '-25px'; // Reduced from -40px
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
                .attr('width', WEFT_WIDTH * 10) 
                .attr('height', TOTAL_WARP_LENGTH * 10)
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
            for (let i = 0; i < numberCuts; i++) {
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
                    .attr('font-size', '1.5px')
                    .attr('font-weight', 'bold')
                    .text(`Cut ${i + 1}`);
            }
        });
    }

    // Initialize visualization
    updateVisualization();
});