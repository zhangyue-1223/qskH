;(function () {
  function ensureStyles() {
    if (document.getElementById('customer-cost-modal-styles')) return;
    var style = document.createElement('style');
    style.id = 'customer-cost-modal-styles';
    style.textContent = '#modal-customer-cost:not(.hidden){display:flex}';
    document.head.appendChild(style);
  }

  function bindOpenSelectors(selectors) {
    (selectors || []).forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (btn) {
        if (btn._customerCostBound) return;
        btn._customerCostBound = true;
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          var row = btn.closest('tr');
          var company = '';
          if (row) {
            var nameCell = row.querySelector('td:nth-child(2)');
            if (nameCell) company = nameCell.textContent.trim();
          }
          if (typeof window.openCustomerCostModal === 'function') {
            window.openCustomerCostModal({ company: company });
          }
        });
      });
    });
  }

  function resetForm(modal) {
    var typeSel = modal.querySelector('#cost-type');
    var amountInp = modal.querySelector('#cost-amount');
    var remarkInp = modal.querySelector('#cost-remark');
    var fileInp = modal.querySelector('#cost-attachment');
    var fileNameEl = modal.querySelector('#cost-attachment-name');
    if (typeSel) typeSel.selectedIndex = 0;
    if (amountInp) amountInp.value = '';
    if (remarkInp) remarkInp.value = '';
    if (fileInp) fileInp.value = '';
    if (fileNameEl) fileNameEl.textContent = '';
  }

  window.mountCustomerCostModal = function (opts) {
    opts = opts || {};
    ensureStyles();
    var modal = document.getElementById('modal-customer-cost');
    if (!modal) return;

    if (modal._costMounted) {
      bindOpenSelectors(opts.openSelectors);
      return;
    }
    modal._costMounted = true;

    var companyHint = modal.querySelector('#cost-company-hint');
    var fileInp = modal.querySelector('#cost-attachment');
    var fileNameEl = modal.querySelector('#cost-attachment-name');
    var uploadArea = modal.querySelector('#cost-upload-area');

    function showModal(ctx) {
      ctx = ctx || {};
      if (companyHint) {
        companyHint.textContent = ctx.company ? '当前客户：' + ctx.company : '';
        companyHint.classList.toggle('hidden', !ctx.company);
      }
      resetForm(modal);
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      modal.setAttribute('aria-hidden', 'false');
    }
    function hideModal() {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      modal.setAttribute('aria-hidden', 'true');
    }

    window.openCustomerCostModal = showModal;

    document.querySelectorAll('[data-close="customer-cost"]').forEach(function (el) {
      el.addEventListener('click', hideModal);
    });

    var okBtn = modal.querySelector('#btn-cost-ok');
    if (okBtn) {
      okBtn.addEventListener('click', function () {
        hideModal();
      });
    }

    if (uploadArea && fileInp) {
      uploadArea.addEventListener('click', function () { fileInp.click(); });
      uploadArea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInp.click();
        }
      });
      fileInp.addEventListener('change', function () {
        if (!fileNameEl) return;
        var file = fileInp.files && fileInp.files[0];
        fileNameEl.textContent = file ? file.name : '';
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) hideModal();
    });

    bindOpenSelectors(opts.openSelectors || ['.js-add-customer-cost']);
  };
})();
