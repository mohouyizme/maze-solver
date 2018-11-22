import $ from 'jquery';

export default class Dom {
  updateContainerWidth(size) {
    $('.maze')
      .width(size * 50)
      .height(size * 50);
  }

  generateMaze(maze) {
    maze.forEach((row, x) => {
      row.forEach((col, y) => {
        $('.maze').append(`<div class="box box-${x}-${y}"></div>`);
        this.updateBorders(maze);
      });
    });
  }

  updateBorders(maze) {
    let side;

    maze.forEach(row =>
      row.forEach(col => {
        col.walls.forEach((bool, i) => {
          let boldBorder = false;

          switch (i) {
            case 0:
              side = 'top';
              if (col.location.row === 0) boldBorder = true;
              break;
            case 1:
              side = 'right';
              if (col.location.col === maze.length - 1) boldBorder = true;
              break;
            case 2:
              side = 'bottom';
              if (col.location.row === maze.length - 1) boldBorder = true;
              break;
            case 3:
              side = 'left';
              if (col.location.col === 0) boldBorder = true;
              break;
          }
          $(`.box-${col.location.row}-${col.location.col}`).css(
            `border-${side}-width`,
            `${bool ? (boldBorder ? '4px' : '2px') : '0px'}`
          );
        });
      })
    );
  }

  moveTracker(row, col, hide) {
    const tracker = $('.tracker')
      .css('top', `${row * 50}px`)
      .css('left', `${col * 50}px`);

    if (hide) tracker.hide();
    else tracker.show();
  }

  addOrRemoveClass(row, col, action, className) {
    const box = $(`.box-${row}-${col}`);

    if (action === 'rem') console.log('lol');
    if (action === 'add') box.addClass(className);
    else if (action === 'remove') box.removeClass(className);
  }
}
