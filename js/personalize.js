// Jornada de personalização — Aflorar Cestas
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('wizard-form');
    var steps = Array.prototype.slice.call(document.querySelectorAll('.wizard-step'));
    var progressSteps = Array.prototype.slice.call(document.querySelectorAll('.wizard-progress-step'));
    var backBtn = document.getElementById('wizard-back');
    var nextBtn = document.getElementById('wizard-next');
    var submitBtn = document.getElementById('wizard-submit');
    var totalSteps = steps.length;
    var current = 1;

    if (!form || !steps.length) return;

    function getStepEl(n) {
      return steps.filter(function (s) { return Number(s.getAttribute('data-step')) === n; })[0];
    }

    function updateConditionals() {
      var conditionals = form.querySelectorAll('.wizard-conditional');
      conditionals.forEach(function (block) {
        var rule = block.getAttribute('data-show-when');
        var parts = rule.split('=');
        var fieldName = parts[0];
        var expectedValue = parts[1];
        var field = form.querySelector('input[name="' + fieldName + '"]:checked');
        var matches = field && field.value === expectedValue;
        block.classList.toggle('is-visible', !!matches);
      });
    }

    function validateStep(n) {
      var stepEl = getStepEl(n);
      var errorEl = form.querySelector('.wizard-error[data-error-for="' + n + '"]');
      if (n === 1) {
        var chosen = form.querySelector('input[name="cesta"]:checked');
        if (!chosen) {
          if (errorEl) errorEl.classList.add('is-visible');
          return false;
        }
      }
      if (errorEl) errorEl.classList.remove('is-visible');
      return true;
    }

    function buildSummary() {
      var list = document.getElementById('wizard-summary-list');
      if (!list) return;
      var data = new FormData(form);
      var items = [];

      var cesta = data.get('cesta');
      if (cesta) items.push(['Cesta', cesta]);

      var bento = data.get('bento');
      if (bento === 'Com Bento Cake') {
        var frase = data.get('bento_frase');
        items.push(['Bento Cake', frase ? 'Sim — frase: "' + frase + '"' : 'Sim']);
      } else {
        items.push(['Bento Cake', 'Não']);
      }

      var caneca = data.get('caneca');
      if (caneca === 'Caneca personalizada') {
        var canecaTexto = data.get('caneca_texto');
        items.push(['Caneca', canecaTexto ? 'Personalizada — "' + canecaTexto + '"' : 'Personalizada']);
      } else {
        items.push(['Caneca', 'Padrão']);
      }

      var flores = data.get('flores');
      items.push(['Flores', flores || 'Sem flores']);

      var cartao = data.get('cartao');
      items.push(['Cartão', cartao ? cartao : 'Sem mensagem no cartão']);

      var acabamento = data.get('acabamento');
      items.push(['Acabamento', acabamento || 'Celofane com laço simples']);

      list.innerHTML = items.map(function (pair) {
        return '<li><strong>' + pair[0] + ':</strong> ' + pair[1] + '</li>';
      }).join('');
    }

    function buildWhatsappLink() {
      var data = new FormData(form);
      var lines = [];
      lines.push('Olá! Quero fazer um pedido personalizado:');
      lines.push('');
      lines.push('Cesta: ' + (data.get('cesta') || '-'));

      if (data.get('bento') === 'Com Bento Cake') {
        var frase = data.get('bento_frase');
        lines.push('Bento Cake: Sim' + (frase ? ' — frase: "' + frase + '"' : ''));
      } else {
        lines.push('Bento Cake: Não');
      }

      if (data.get('caneca') === 'Caneca personalizada') {
        var canecaTexto = data.get('caneca_texto');
        lines.push('Caneca: Personalizada' + (canecaTexto ? ' — "' + canecaTexto + '"' : ''));
      } else {
        lines.push('Caneca: Padrão');
      }

      lines.push('Flores: ' + (data.get('flores') || 'Sem flores'));
      lines.push('Cartão: ' + (data.get('cartao') || 'Sem mensagem'));
      lines.push('Acabamento: ' + (data.get('acabamento') || 'Celofane com laço simples'));

      var text = encodeURIComponent(lines.join('\n'));
      return 'https://api.whatsapp.com/send?phone=5534991825081&text=' + text;
    }

    function goToStep(n) {
      steps.forEach(function (s) {
        s.classList.toggle('is-active', Number(s.getAttribute('data-step')) === n);
      });
      progressSteps.forEach(function (p) {
        var stepNum = Number(p.getAttribute('data-step'));
        p.classList.toggle('is-active', stepNum === n);
        p.classList.toggle('is-done', stepNum < n);
      });
      backBtn.disabled = n === 1;

      if (n === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
        buildSummary();
      } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
      }

      updateConditionals();
      current = n;
      window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
    }

    nextBtn.addEventListener('click', function () {
      if (!validateStep(current)) return;
      if (current < totalSteps) goToStep(current + 1);
    });

    backBtn.addEventListener('click', function () {
      if (current > 1) goToStep(current - 1);
    });

    form.addEventListener('change', updateConditionals);

    submitBtn.addEventListener('click', function (e) {
      e.preventDefault();
      submitBtn.href = buildWhatsappLink();
      window.open(submitBtn.href, '_blank');
    });

    goToStep(1);
  });
})();
