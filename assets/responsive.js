;(function () {
  'use strict';

  var SCROLL_CLASS = 'qsk-table-scroll';
  var SCROLL_PARENT_OVERFLOW = ['auto', 'scroll', 'overlay'];
  var MODAL_OPEN_SELECTOR =
    '.fixed.inset-0[id*="modal"]:not(.hidden):not(#sidebar-backdrop),' +
    '.fixed.inset-0[role="dialog"]:not(.hidden),' +
    '#order-detail-modal:not(.hidden),' +
    '#quote-preview-modal:not(.hidden),' +
    '#modal-create-contract:not(.hidden)';

  var modalSyncLock = false;
  var modalSyncTimer = null;
  var tableObserver = null;

  function hasScrollParent(el) {
    var node = el.parentElement;
    while (node && node !== document.body) {
      if (node.classList.contains(SCROLL_CLASS) || node.classList.contains('table-scroll')) {
        return true;
      }
      var overflowX = window.getComputedStyle(node).overflowX;
      if (SCROLL_PARENT_OVERFLOW.indexOf(overflowX) !== -1) {
        return true;
      }
      node = node.parentElement;
    }
    return false;
  }

  function shouldWrapTable(table) {
    if (!table || table.tagName !== 'TABLE') return false;
    if (table.closest('.' + SCROLL_CLASS) || table.closest('.table-scroll')) return false;
    if (hasScrollParent(table)) return false;
    return true;
  }

  function wrapTable(table) {
    if (!shouldWrapTable(table)) return;
    var wrap = document.createElement('div');
    wrap.className = SCROLL_CLASS;
    wrap.setAttribute('data-qsk-table-wrap', '1');
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  }

  function wrapTables(root) {
    (root || document).querySelectorAll('table').forEach(wrapTable);
  }

  function markDocPages() {
    var path = (location.pathname || '').replace(/\\/g, '/');
    if (path.indexOf('/docs/') !== -1 || /docs\/.+\.html$/i.test(path)) {
      document.body.classList.add('qsk-doc');
    }
  }

  function closeSidebarDrawer() {
    var sidebar = document.getElementById('app-sidebar');
    var backdrop = document.getElementById('sidebar-backdrop');
    var toggle = document.getElementById('btn-sidebar-toggle');
    if (!sidebar) return;
    sidebar.classList.add('-translate-x-full');
    sidebar.classList.remove('translate-x-0');
    if (backdrop) backdrop.classList.add('hidden');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  function isModalOpen() {
    return !!document.querySelector(MODAL_OPEN_SELECTOR);
  }

  function syncModalState() {
    if (modalSyncLock) return;
    modalSyncLock = true;
    try {
      var open = isModalOpen();
      document.body.classList.toggle('qsk-modal-open', open);
      if (open) closeSidebarDrawer();
    } finally {
      modalSyncLock = false;
    }
  }

  function scheduleModalSync() {
    clearTimeout(modalSyncTimer);
    modalSyncTimer = setTimeout(syncModalState, 32);
  }

  function isModalRelatedNode(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.id === 'sidebar-backdrop' || el.id === 'app-sidebar') return false;
    var id = el.id || '';
    if (id.indexOf('modal') !== -1) return true;
    if (el.matches && el.matches('.fixed.inset-0[role="dialog"], #order-detail-modal, #quote-preview-modal, #modal-create-contract')) {
      return true;
    }
    return false;
  }

  function observeModals() {
    var observer = new MutationObserver(function (mutations) {
      var changed = false;
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === 'attributes' && m.attributeName === 'class' && isModalRelatedNode(m.target)) {
          changed = true;
          break;
        }
        if (m.type === 'childList') {
          for (var j = 0; j < m.addedNodes.length; j++) {
            var node = m.addedNodes[j];
            if (node.nodeType !== 1) continue;
            if (isModalRelatedNode(node) || (node.querySelector && node.querySelector('[id*="modal"], [role="dialog"]'))) {
              changed = true;
              break;
            }
          }
        }
        if (changed) break;
      }
      if (changed) scheduleModalSync();
    });
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      childList: true,
      attributeFilter: ['class']
    });
    syncModalState();
  }

  function observeDynamicContent() {
    tableObserver = new MutationObserver(function (mutations) {
      var pending = [];
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.tagName === 'TABLE') {
            pending.push(node);
            return;
          }
          if (node.querySelectorAll) {
            node.querySelectorAll('table').forEach(function (table) {
              pending.push(table);
            });
          }
        });
      });
      if (!pending.length) return;
      if (tableObserver) tableObserver.disconnect();
      pending.forEach(wrapTable);
      if (tableObserver) {
        tableObserver.observe(document.body, { childList: true, subtree: true });
      }
    });
    tableObserver.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    markDocPages();
    wrapTables(document);
    observeModals();
    observeDynamicContent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.QskResponsive = { wrapTables: wrapTables, syncModalState: syncModalState };
})();
