class Block {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.isPlaced = false;
        this.coordinates = { top: null, left: null, right: null, bottom: null };
        this.color = null;
    }
}

class Container {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.freeSpaces = [{ top: 0, left: 0, right: width, bottom: height }];
    }
}

function packBlocks(blocks, container) {
    blocks.sort((a, b) => b.width * b.height - a.width * a.height);

    for (const block of blocks) {
        for (const space of container.freeSpaces) {
            if ((block.width <= space.right - space.left && block.height <= space.bottom - space.top)) {
                
                block.coordinates = {
                    top: space.top,
                    left: space.left,
                    right: block.width <= space.right - space.left ? space.left + block.width : space.right,
                    bottom: block.height <= space.bottom - space.top ? space.top + block.height : space.bottom
                };
                block.isPlaced = true;

                const newFreeSpaces = [];
                if (block.coordinates.top > space.top) {
                    newFreeSpaces.push({ top: space.top, left: space.left, right: space.right, bottom: block.coordinates.top });
                }
                if (block.coordinates.bottom < space.bottom) {
                    newFreeSpaces.push({ top: block.coordinates.bottom, left: space.left, right: space.right, bottom: space.bottom });
                }
                if (block.coordinates.left > space.left) {
                    newFreeSpaces.push({ top: space.top, left: space.left, right: block.coordinates.left, bottom: block.coordinates.bottom });
                }
                if (block.coordinates.right < space.right) {
                    newFreeSpaces.push({ top: space.top, left: block.coordinates.right, right: space.right, bottom: block.coordinates.bottom });
                }

                container.freeSpaces = container.freeSpaces.filter(s => s !== space);
                container.freeSpaces.push(...newFreeSpaces);

                break;
            }
        }
    }

    addColorToBlocks(blocks);

    const totalBlockArea = blocks.reduce((total, block) => total + (block.width * block.height), 0);
    const freeSpacesArea = container.freeSpaces.reduce((total, space) => total + ((space.right - space.left) * (space.bottom - space.top)), 0);
    const fullness = 1 - (freeSpacesArea / (freeSpacesArea + totalBlockArea));

    const blockCoordinates = blocks.filter(block => block.isPlaced).map((block, index) => ({
        top: block.coordinates.top,
        left: block.coordinates.left,
        right: block.coordinates.right,
        bottom: block.coordinates.bottom,
        initialOrder: index,
        color: block.color
    }));

    return { fullness, blockCoordinates };
}

function getRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function addColorToBlocks(blocks) {
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].color === null) {
            blocks[i].color = getRandomHexColor();
        }
        for (let j = i + 1; j < blocks.length; j++) {
            if (blocks[i].width === blocks[j].width && blocks[i].height === blocks[j].height) {
                if (blocks[j].color === null) {
                    blocks[j].color = blocks[i].color;
                }
            }
        }
    }
}

const blocksInfo = [
    { width: 250, height: 250 }, 
    { width: 200, height: 200 }, 
    { width: 250, height: 150 }, 
    { width: 250, height: 150 }, 
    { width: 250, height: 150 }, 
    { width: 250, height: 150 }, 
    { width: 250, height: 50 }, 
    { width: 250, height: 50 }, 
    { width: 250, height: 50 }, 
    { width: 250, height: 50 }, 
    { width: 250, height: 50 }, 
    { width: 250, height: 50 }, 
    { width: 250, height: 50 }, 
    { width: 250, height: 50 }, 
    { width: 50, height: 100 }, 
];
const containerInfo = { width: 500, height: 500 };
const blocks = blocksInfo.map(info => new Block(info.width, info.height));
const container = new Container(containerInfo.width, containerInfo.height);

const result = packBlocks(blocks, container);

const containerDiv = document.getElementById('container');
containerDiv.style.width = containerInfo.width + 'px';
containerDiv.style.height = containerInfo.height + 'px';

const fullness = document.getElementById('fullness');

fullness.textContent = `Fullness: ${result.fullness.toFixed(2)}`
result.blockCoordinates.forEach(coords => {
    const block = document.createElement('div');
    block.className = 'block';
    block.textContent = `Block ${coords.initialOrder}`;
    block.style.width = `${coords.right - coords.left}px`;
    block.style.height = `${coords.bottom - coords.top}px`;
    block.style.top = `${coords.top}px`;
    block.style.left = `${coords.left}px`;
    block.style.right = `${coords.right}px`;
    block.style.bottom = `${coords.bottom}px`;
    block.style.backgroundColor = `${coords.color}`;
    containerDiv.appendChild(block);
});


