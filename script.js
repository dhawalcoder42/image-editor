document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.swiper', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    allowTouchMove: true,
    touchMoveStopPropagation: false,
    simulateTouch: false,
  });

  let activeText = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let resizing = false;
  let resizeStartX = 0;
  let resizeStartY = 0;
  let resizeStartWidth = 0;
  let resizeStartHeight = 0;

  function makeTextDraggable(element) {
    let isDragging = false;

    element.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      activateText(element);
      isDragging = true;
      dragOffsetX = e.clientX - element.offsetLeft;
      dragOffsetY = e.clientY - element.offsetTop;
      element.style.cursor = 'grabbing';
      swiper.allowTouchMove = false;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        let x = e.clientX - dragOffsetX;
        let y = e.clientY - dragOffsetY;

        const parentRect = element.parentElement.getBoundingClientRect();
        const maxX = parentRect.width - element.offsetWidth;
        const maxY = parentRect.height - element.offsetHeight;

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      element.style.cursor = 'grab';
      swiper.allowTouchMove = true;
    });
  }

  function makeTextResizable(element) {
    const resizer = document.createElement('div');
    resizer.classList.add('resizer');
    element.appendChild(resizer);

    resizer.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      activateText(element);
      resizing = true;
      resizeStartX = e.clientX;
      resizeStartY = e.clientY;
      resizeStartWidth = element.offsetWidth;
      resizeStartHeight = element.offsetHeight;
      swiper.allowTouchMove = false;
    });

    document.addEventListener('mousemove', (e) => {
      if (resizing && activeText === element) {
        const width = Math.max(50, resizeStartWidth + (e.clientX - resizeStartX));
        const height = Math.max(20, resizeStartHeight + (e.clientY - resizeStartY));

        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
        element.style.fontSize = `${height / 2}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      resizing = false;
      swiper.allowTouchMove = true;
    });
  }

  function activateText(element) {
    document.querySelectorAll('.draggable-text').forEach((text) => {
      text.classList.remove('active-box');
    });

    activeText = element;
    element.classList.add('active-box');
    document.getElementById('textInput').value = element.textContent;
    document.getElementById('fontFamily').value = element.style.fontFamily || 'Arial';
    document.getElementById('fontColor').value = element.style.color || '#000000';
    document.getElementById('fontSize').value = parseInt(element.style.fontSize, 10) || 25;

    if (!element.querySelector('.resizer')) {
      makeTextResizable(element);
    }
  }

  function deactivateActiveText() {
    if (activeText) {
      activeText.classList.remove('active-box');
      activeText = null;
      document.getElementById('textInput').value = '';
      document.getElementById('fontFamily').value = 'Arial';
      document.getElementById('fontColor').value = '#000000';
      document.getElementById('fontSize').value = 25;
    }
  }

  document.addEventListener('mousedown', (e) => {
    if (activeText && !activeText.contains(e.target) && !e.target.closest('.tools-panel')) {
      deactivateActiveText();
    }
  });

  document.getElementById('textInput').addEventListener('input', (e) => {
    if (activeText) {
      activeText.textContent = e.target.value;
    }
  });

  document.getElementById('addText').addEventListener('click', () => {
    const activeSlide = document.querySelector('.swiper-slide-active');
    const newText = document.createElement('div');
    newText.className = 'draggable-text';
    newText.textContent = document.getElementById('textInput').value || 'New Text';
    newText.style.position = 'absolute';
    newText.style.left = '10px';
    newText.style.top = '10px';
    newText.style.width = '100px';
    newText.style.height = '50px';
    newText.style.fontSize = '25px';
    newText.style.fontFamily = document.getElementById('fontFamily').value || 'Arial';
    newText.style.color = document.getElementById('fontColor').value || '#000000';

    activeSlide.appendChild(newText);

    makeTextDraggable(newText);
    makeTextResizable(newText);

    newText.addEventListener('click', () => {
      activateText(newText);
    });

    activateText(newText);
  });

  document.querySelectorAll('.draggable-text').forEach((text) => {
    makeTextDraggable(text);
    makeTextResizable(text);

    text.addEventListener('click', () => {
      activateText(text);
    });
  });

  document.getElementById('fontFamily').addEventListener('change', (e) => {
    if (activeText) {
      activeText.style.fontFamily = e.target.value;
    }
  });

  document.getElementById('fontColor').addEventListener('input', (e) => {
    if (activeText) {
      activeText.style.color = e.target.value;
    }
  });

  document.getElementById('fontSize').addEventListener('input', (e) => {
    if (activeText) {
      activeText.style.fontSize = `${e.target.value}px`;
    }
  });

  document.getElementById('boldText').addEventListener('click', () => {
    if (activeText) {
      activeText.style.fontWeight =
        activeText.style.fontWeight === 'bold' ? 'normal' : 'bold';
    }
  });

  document.getElementById('italicText').addEventListener('click', () => {
    if (activeText) {
      activeText.style.fontStyle =
        activeText.style.fontStyle === 'italic' ? 'normal' : 'italic';
    }
  });

  document.getElementById('underlineText').addEventListener('click', () => {
    if (activeText) {
      activeText.style.textDecoration =
        activeText.style.textDecoration === 'underline' ? 'none' : 'underline';
    }
  });

  document.getElementById('alignLeft').addEventListener('click', () => {
    if (activeText) {
      activeText.style.textAlign = 'left';
    }
  });

  document.getElementById('alignCenter').addEventListener('click', () => {
    if (activeText) {
      activeText.style.textAlign = 'center';
    }
  });

  document.getElementById('alignRight').addEventListener('click', () => {
    if (activeText) {
      activeText.style.textAlign = 'right';
    }
  });

  document.getElementById('deleteText').addEventListener('click', () => {
    if (activeText) {
      activeText.remove();
      deactivateActiveText();
    }
  });

  document.getElementById('customizePages').addEventListener('click', () => {
    const pageList = document.querySelector('.page-list');
    const slides = document.querySelectorAll('.swiper-slide');

    pageList.innerHTML = '';
    slides.forEach((slide, index) => {
      const listItem = document.createElement('li');
      listItem.setAttribute('data-index', index);
      listItem.textContent = `Page ${index + 1}`;
      listItem.draggable = true;

      pageList.appendChild(listItem);
    });

    document.getElementById('pageModal').style.display = 'flex';

    let draggedItem = null;
    pageList.addEventListener('dragstart', (e) => {
      draggedItem = e.target;
      setTimeout(() => e.target.classList.add('hidden'), 0);
    });

    pageList.addEventListener('dragend', (e) => {
      e.target.classList.remove('hidden');
    });

    pageList.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(pageList, e.clientY);
      if (afterElement == null) {
        pageList.appendChild(draggedItem);
      } else {
        pageList.insertBefore(draggedItem, afterElement);
      }
    });

    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('li:not(.hidden)')];
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
  });

  document.getElementById('savePages').addEventListener('click', () => {
    const pageList = document.querySelector('.page-list');
    const newOrder = [...pageList.children].map((item) => item.getAttribute('data-index'));

    const slides = document.querySelector('.swiper-wrapper');
    const reorderedSlides = newOrder.map((index) => slides.children[index]);

    slides.innerHTML = '';
    reorderedSlides.forEach((slide) => slides.appendChild(slide));

    swiper.update();
    document.getElementById('pageModal').style.display = 'none';
  });

  document.getElementById('cancelPages').addEventListener('click', () => {
    document.getElementById('pageModal').style.display = 'none';
  });
});
