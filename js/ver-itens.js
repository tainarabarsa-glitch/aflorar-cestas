// Accordion "Ver itens" — Aflorar Cestas
// Substitui a dependência do sistema de interações do Webflow (que só reconhece
// IDs pré-compilados), garantindo que TODOS os produtos (antigos e novos) funcionem.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var questions = document.querySelectorAll('.faq5_question');

    questions.forEach(function (question) {
      // Evita duplicar o comportamento nativo do Webflow, se ele existir
      question.removeAttribute('data-w-id');

      var answer = question.nextElementSibling;
      if (!answer || !answer.classList.contains('faq5_answer')) return;

      answer.style.transition = 'height 0.3s ease';
      answer.style.height = '0px';

      question.addEventListener('click', function () {
        var isOpen = question.classList.contains('is-open');

        if (isOpen) {
          // Fechar: define altura atual antes de animar para 0
          answer.style.height = answer.scrollHeight + 'px';
          requestAnimationFrame(function () {
            answer.style.height = '0px';
          });
          question.classList.remove('is-open');
        } else {
          // Abrir: mede a altura do conteúdo e anima até lá
          answer.style.height = answer.scrollHeight + 'px';
          question.classList.add('is-open');
        }
      });

      // Depois da transição de abertura, libera para 'auto' (acompanha resize/conteúdo dinâmico)
      answer.addEventListener('transitionend', function () {
        if (question.classList.contains('is-open')) {
          answer.style.height = 'auto';
        }
      });
    });
  });
})();
