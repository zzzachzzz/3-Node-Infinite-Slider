# 3-Node-Infinite-Slider
Infinitely wrapping slider / carousel recycling 3 nodes instead of polluting the DOM with extra nodes.  
Demo with cute dog photos :dog: https://zzzachzzz.github.io/3-Node-Infinite-Slider :dog2:

The usual problems when creating a slider / carousel:
- In order to make the slider scroll infinitely (wrap around and repeat elements), this normally requires injecting duplicate nodes before or after the original elements to continue the transition flow for a given direction. The approach taken here is to maintain 3 nodes: current, previous, and next, and updating these elements during each navigation action.
- A problem arises when nodes are inserted or rearranged; the translateX offset loses its position and must be recalculated, assigned, and do so without any undesired transition effects.  
This issue is circumvented through the following sequence:
> 1. Show slider transition effect, then set `transition: none`
> 2. Update previous, current, and next nodes
> 3. Reset transition to `all <duration>s`
