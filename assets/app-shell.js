(function () {
  var sidebar = document.getElementById('app-sidebar');
  var backdrop = document.getElementById('sidebar-backdrop');
  var toggle = document.getElementById('btn-sidebar-toggle');

  var STORAGE_KEY = 'qsk-sidebar-open-groups';
  var currentFile = (location.pathname.split('/').pop() || 'index.html').split('?')[0].split('#')[0];
  if (!currentFile) currentFile = 'index.html';

  /** 详情页归属的一级菜单入口 */
  var DETAIL_PARENT = {
    'customer-detail.html': 'customer-management.html',
    'customer-edit.html': 'customer-management.html',
    'government-affairs-detail.html': 'government-affairs.html',
    'accounting-customer-detail.html': 'accounting-customer-management.html',
    'address-room-detail.html': 'address-management.html',
    'opportunity-detail.html': 'opportunity-management.html',
    'lead-follow-detail.html': 'lead-management.html',
    'employee-profile.html': 'department-employees.html',
    'employee-edit.html': 'department-employees.html'
  };

  function escapeHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function linkHrefFile(href) {
    if (!href || href === '#') return '';
    return href.split('?')[0].split('#')[0];
  }

  function isActiveNavLink(href) {
    var file = linkHrefFile(href);
    if (!file) return false;
    if (file === currentFile) return true;
    var parent = DETAIL_PARENT[currentFile];
    return !!(parent && file === parent);
  }

  function renderSidebarFromMenuData(nav) {
    if (!nav || !window.MenuData) return false;
    var menus = MenuData.getMenus().filter(function (m) { return m.enabled !== false; });
    var html = '';
    var chevron = '<i class="fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform group-open:rotate-180"></i>';

    menus.forEach(function (item) {
      var children = (item.children || []).filter(function (c) { return c.enabled !== false; });
      var isGroup = item.type === 'group' || children.length > 0;

      if (isGroup) {
        if (!children.length) return;
        var groupActive = false;
        var childHtml = children.map(function (child) {
          var active = isActiveNavLink(child.href);
          if (active) groupActive = true;
          var cls = active
            ? 'block py-2 px-3 rounded-lg text-sm bg-blue-600 text-white font-medium'
            : 'block py-2 px-3 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white';
          var href = child.href && child.href !== '#' ? child.href : '#';
          return '<a class="' + cls + '" href="' + escapeHtml(href) + '">' + escapeHtml(child.name) + '</a>';
        }).join('');
        var summaryCls = groupActive
          ? 'list-none cursor-pointer h-10 px-4 rounded-lg bg-slate-800/80 flex items-center justify-between text-white [&::-webkit-details-marker]:hidden'
          : 'list-none cursor-pointer h-10 px-4 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 [&::-webkit-details-marker]:hidden';
        var icon = item.icon ? 'fa-solid ' + item.icon : 'fa-solid fa-folder';
        html += '<details class="mx-3 mb-1 group"' + (groupActive ? ' open' : '') + '>' +
          '<summary class="' + summaryCls + '">' +
          '<span class="flex items-center"><i class="' + icon + ' w-5 mr-2"></i>' + escapeHtml(item.name) + '</span>' +
          chevron + '</summary>' +
          '<div class="mt-1 ml-2 pl-3 border-l border-slate-700 space-y-0.5">' + childHtml + '</div></details>';
        return;
      }

      var linkActive = isActiveNavLink(item.href);
      var linkCls = 'mx-3 mb-1 h-10 px-4 rounded-lg flex items-center ' +
        (linkActive ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-200');
      var linkIcon = item.icon ? 'fa-solid ' + item.icon : 'fa-solid fa-link';
      html += '<a class="' + linkCls + '" href="' + escapeHtml(item.href || '#') + '">' +
        '<i class="' + linkIcon + ' w-5 mr-2"></i>' + escapeHtml(item.name) + '</a>';
    });

    nav.innerHTML = html;
    nav.setAttribute('data-sidebar-rendered', 'menu-data');
    return true;
  }

  function loadMenuDataScript(cb) {
    if (window.MenuData) {
      cb();
      return;
    }
    var existing = document.querySelector('script[data-qsk-menu-data]');
    if (existing) {
      existing.addEventListener('load', cb);
      return;
    }
    var script = document.createElement('script');
    script.src = './assets/menu-data.js';
    script.setAttribute('data-qsk-menu-data', '1');
    script.onload = cb;
    script.onerror = cb;
    document.head.appendChild(script);
  }

  function initSidebarBehavior() {
    if (!sidebar) return;
    var nav = sidebar.querySelector('nav');
    if (!nav) return;

    function getGroupId(detailsEl) {
      var summary = detailsEl.querySelector('summary');
      if (!summary) return '';
      var label = summary.querySelector('span');
      return (label ? label.textContent : summary.textContent).replace(/\s+/g, ' ').trim();
    }

    function loadOpenGroups() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        var list = raw ? JSON.parse(raw) : [];
        return Array.isArray(list) ? list : [];
      } catch (e) {
        return [];
      }
    }

    function saveOpenGroups() {
      var ids = [];
      nav.querySelectorAll('details').forEach(function (detailsEl) {
        if (detailsEl.open) {
          var id = getGroupId(detailsEl);
          if (id && ids.indexOf(id) === -1) ids.push(id);
        }
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      } catch (e) { /* ignore */ }
    }

    function openDetailsByIds(ids) {
      if (!ids || !ids.length) return;
      nav.querySelectorAll('details').forEach(function (detailsEl) {
        var id = getGroupId(detailsEl);
        if (id && ids.indexOf(id) !== -1) detailsEl.open = true;
      });
    }

    function openDetailsForCurrentPage() {
      nav.querySelectorAll('details').forEach(function (detailsEl) {
        var links = detailsEl.querySelectorAll('a[href]');
        for (var i = 0; i < links.length; i++) {
          if (isActiveNavLink(links[i].getAttribute('href'))) {
            detailsEl.open = true;
            return;
          }
        }
      });
    }

    openDetailsForCurrentPage();
    openDetailsByIds(loadOpenGroups());

    nav.querySelectorAll('details').forEach(function (detailsEl) {
      detailsEl.addEventListener('toggle', saveOpenGroups);
    });

    nav.querySelectorAll('details a[href]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      link.addEventListener('click', function () {
        var group = link.closest('details');
        if (group) group.open = true;
        saveOpenGroups();
      });
    });
  }

  function boot() {
    if (toggle && sidebar && backdrop) {
      function setSidebarDrawerOpen(open) {
        sidebar.classList.toggle('-translate-x-full', !open);
        sidebar.classList.toggle('translate-x-0', open);
        backdrop.classList.toggle('hidden', !open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      toggle.addEventListener('click', function () {
        setSidebarDrawerOpen(sidebar.classList.contains('-translate-x-full'));
      });
      backdrop.addEventListener('click', function () {
        setSidebarDrawerOpen(false);
      });
    }

    if (!sidebar) return;
    var nav = sidebar.querySelector('nav');
    if (!nav) return;

    loadMenuDataScript(function () {
      renderSidebarFromMenuData(nav);
      initSidebarBehavior();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
