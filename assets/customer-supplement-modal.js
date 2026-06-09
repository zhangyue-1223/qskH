;(function () {
  function ensureStyles() {
    if (document.getElementById('customer-supplement-modal-styles')) return;
    var style = document.createElement('style');
    style.id = 'customer-supplement-modal-styles';
    style.textContent =
      '#modal-supplement:not(.hidden){display:flex}' +
      '.field-label{font-size:12px;color:#334155;margin-bottom:4px;display:block}' +
      '.field-input{height:34px;width:100%;border:1px solid #e2e8f0;border-radius:4px;padding:0 10px;font-size:12px;color:#0f172a}' +
      '.field-input::placeholder,.field-textarea::placeholder{color:#94a3b8}' +
      '.field-textarea{width:100%;border:1px solid #e2e8f0;border-radius:4px;padding:8px 10px;font-size:12px;color:#0f172a;resize:vertical;min-height:68px}' +
      '.upload-card{height:86px;border:1px solid #dbeafe;border-radius:4px;background:#f0f7ff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#0ea5e9;font-size:11px;cursor:pointer}' +
      '.entity-type-box{height:34px;width:100%;border:1px solid #e2e8f0;border-radius:4px;padding:0 10px;display:flex;align-items:center;gap:16px;font-size:12px}' +
      '.entity-type-box label{display:inline-flex;align-items:center;gap:6px;color:#475569;cursor:pointer}' +
      '.shareholder-block+.shareholder-block{margin-top:10px;padding-top:10px;border-top:1px dashed #e2e8f0}';
    document.head.appendChild(style);
  }

  function bindOpenSelectors(selectors) {
    (selectors || []).forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (btn) {
        if (btn._customerSuppBound) return;
        btn._customerSuppBound = true;
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          if (typeof window.openCustomerSupplementModal === 'function') {
            window.openCustomerSupplementModal();
          }
        });
      });
    });
  }

  window.mountCustomerSupplementModal = function (opts) {
    opts = opts || {};
    ensureStyles();
    var modalSupplement = document.getElementById('modal-supplement');
    if (!modalSupplement) return;

    if (modalSupplement._supplementMounted) {
      bindOpenSelectors(opts.openSelectors);
      return;
    }
    modalSupplement._supplementMounted = true;

    var supplementTabs = document.querySelectorAll('#supplement-tabs .supp-tab');
    var suppTaxPanel = document.getElementById('supp-panel-tax');
    var suppIndustryPanel = document.getElementById('supp-panel-industry');
    var suppShareholderList = document.getElementById('supp-shareholder-list');
    var suppAddShareholderBtn = document.getElementById('supp-add-shareholder');
    var suppShareholderIndex = 0;

    function showSupplementModal() {
      modalSupplement.classList.remove('hidden');
      modalSupplement.classList.add('flex');
      modalSupplement.setAttribute('aria-hidden', 'false');
    }
    function hideSupplementModal() {
      modalSupplement.classList.add('hidden');
      modalSupplement.classList.remove('flex');
      modalSupplement.setAttribute('aria-hidden', 'true');
    }
    function switchSupplementTab(tab) {
      supplementTabs.forEach(function (btn) {
        var on = btn.getAttribute('data-tab') === tab;
        btn.classList.toggle('border-blue-600', on);
        btn.classList.toggle('text-blue-600', on);
        btn.classList.toggle('font-medium', on);
        btn.classList.toggle('border-transparent', !on);
        btn.classList.toggle('text-slate-500', !on);
      });
      if (suppTaxPanel) suppTaxPanel.classList.toggle('hidden', tab !== 'tax');
      if (suppIndustryPanel) suppIndustryPanel.classList.toggle('hidden', tab !== 'industry');
    }
    function applySuppEntityType(block) {
      var personRadio = block.querySelector('.supp-entity-type[value="person"]');
      if (!personRadio) return;
      var isPerson = personRadio.checked;
      var nameLabel = block.querySelector('.supp-sh-name-label');
      var nameInput = block.querySelector('.supp-sh-name');
      var idLabel = block.querySelector('.supp-sh-id-label');
      var idInput = block.querySelector('.supp-sh-id');
      if (!nameLabel || !nameInput || !idLabel || !idInput) return;
      if (isPerson) {
        nameLabel.textContent = '股东姓名';
        nameInput.placeholder = '请输入股东姓名';
        idLabel.textContent = '身份证号码';
        idInput.placeholder = '请输入身份证号码';
      } else {
        nameLabel.textContent = '股东公司名称';
        nameInput.placeholder = '请输入股东公司名称';
        idLabel.textContent = '统一社会信用代码';
        idInput.placeholder = '请输入统一社会信用代码';
      }
    }
    function bindSuppShareholderBlock(block) {
      block.querySelectorAll('.supp-entity-type').forEach(function (radio) {
        radio.addEventListener('change', function () { applySuppEntityType(block); });
      });
      applySuppEntityType(block);
    }
    function createSuppShareholderBlock(index) {
      var wrap = document.createElement('div');
      wrap.className = 'shareholder-block';
      wrap.setAttribute('data-shareholder-index', String(index));
      wrap.innerHTML =
        '<div class="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2.5">' +
        '<label class="supp-sh-name-wrap"><span class="field-label supp-sh-name-label">股东姓名</span><input type="text" class="field-input supp-sh-name" placeholder="请输入股东姓名"></label>' +
        '<div><span class="field-label">主体类型</span><div class="entity-type-box">' +
        '<label><input type="radio" name="supp-entityType-' + index + '" value="person" class="supp-entity-type"> 自然人</label>' +
        '<label><input type="radio" name="supp-entityType-' + index + '" value="company" class="supp-entity-type" checked> 公司</label></div></div>' +
        '<label><span class="field-label">股份占比（%）</span><input type="text" class="field-input" placeholder="请输入股份占比"></label></div>' +
        '<div class="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2.5 mt-2.5">' +
        '<label class="supp-sh-id-wrap"><span class="field-label supp-sh-id-label">统一社会信用代码</span><input type="text" class="field-input supp-sh-id" placeholder="请输入统一社会信用代码"></label>' +
        '<label><span class="field-label">联系电话</span><input type="text" class="field-input" placeholder="请输入联系电话"></label>' +
        '<div class="flex items-end justify-end pb-0.5"><button type="button" class="supp-remove-shareholder text-xs text-slate-500 hover:text-red-600 whitespace-nowrap">删除股东</button></div></div>';
      return wrap;
    }

    window.openCustomerSupplementModal = function () {
      showSupplementModal();
      switchSupplementTab('tax');
    };

    document.querySelectorAll('[data-close="supplement"]').forEach(function (el) {
      el.addEventListener('click', hideSupplementModal);
    });
    supplementTabs.forEach(function (btn) {
      btn.addEventListener('click', function () { switchSupplementTab(btn.getAttribute('data-tab')); });
    });
    switchSupplementTab('tax');

    if (suppShareholderList) {
      var firstSuppBlock = suppShareholderList.querySelector('.shareholder-block');
      if (firstSuppBlock) bindSuppShareholderBlock(firstSuppBlock);
      if (suppAddShareholderBtn) {
        suppAddShareholderBtn.addEventListener('click', function () {
          suppShareholderIndex += 1;
          var block = createSuppShareholderBlock(suppShareholderIndex);
          suppShareholderList.appendChild(block);
          bindSuppShareholderBlock(block);
        });
      }
      suppShareholderList.addEventListener('click', function (e) {
        var btn = e.target.closest('.supp-remove-shareholder');
        if (!btn) return;
        var blocks = suppShareholderList.querySelectorAll('.shareholder-block');
        if (blocks.length <= 1) return;
        btn.closest('.shareholder-block').remove();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modalSupplement.classList.contains('hidden')) hideSupplementModal();
    });

    bindOpenSelectors(opts.openSelectors || ['.js-supplement']);
  };
})();
