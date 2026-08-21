// Filtro por ocasião do catálogo — Aflorar Cestas
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var pills = document.querySelectorAll('.occasion-pill');
    var headings = document.querySelectorAll('.category-heading');
    var emptyMessage = document.querySelector('.occasion-empty-message');

    if (!pills.length || !headings.length) return;

    function applyFilter(filter) {
      var anyVisible = false;

      headings.forEach(function (heading) {
        var grid = heading.nextElementSibling;
        if (!grid) return;
        var items = grid.querySelectorAll('[data-occasion]');
        var groupHasVisible = false;

        items.forEach(function (item) {
          var occasions = (item.getAttribute('data-occasion') || '').split(',');
          var matches = filter === 'all' || occasions.indexOf(filter) !== -1;
          item.style.display = matches ? '' : 'none';
          if (matches) {
            groupHasVisible = true;
            anyVisible = true;
          }
        });

        heading.style.display = groupHasVisible ? '' : 'none';
        grid.style.display = groupHasVisible ? '' : 'none';
      });

      if (emptyMessage) {
        emptyMessage.style.display = anyVisible ? 'none' : 'block';
      }
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('is-active'); });
        pill.classList.add('is-active');
        applyFilter(pill.getAttribute('data-filter'));
      });
    });
  });
})();
