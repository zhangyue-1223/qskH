;(function () {
  function ensureModal() {
    var modal = document.getElementById('modal-create-contract');
    var toast = document.getElementById('toast-create-contract-success');
    if (modal && toast) return { modal: modal, toast: toast };

    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div id="modal-create-contract" class="hidden flex fixed inset-0 z-[180] items-center justify-end bg-slate-900/45" role="dialog" aria-modal="true" aria-labelledby="create-contract-title">' +
      '  <div class="h-full w-full max-w-[860px] bg-white border-l border-slate-200 shadow-2xl flex flex-col">' +
      '    <div class="relative h-14 px-5 border-b border-slate-100 flex items-center justify-between shrink-0">' +
      '      <h2 id="create-contract-title" class="text-base font-semibold text-slate-800">创建合同</h2>' +
      '      <button type="button" class="btn-close-create-contract w-8 h-8 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"><i class="fa-solid fa-xmark"></i></button>' +
      '    </div>' +
      '    <form class="flex-1 overflow-y-auto px-4 py-4 space-y-4">' +
      '      <section class="border border-slate-200 rounded-lg overflow-hidden">' +
      '        <div class="h-9 px-3 bg-slate-50 text-sm text-slate-700 font-medium flex items-center"><span class="w-1 h-4 rounded bg-blue-600 mr-2"></span>基本信息</div>' +
      '        <div class="p-4 space-y-3 text-sm">' +
      '          <div class="flex items-center gap-6">' +
      '            <span class="w-20 text-slate-600">合同类型 <span class="text-red-500">*</span></span>' +
      '            <label class="inline-flex items-center gap-1.5"><input type="radio" name="contractTypeShared" class="accent-blue-600" checked><span>代账合同</span></label>' +
      '            <label class="inline-flex items-center gap-1.5"><input type="radio" name="contractTypeShared" class="accent-blue-600"><span>注册地址合同</span></label>' +
      '            <label class="inline-flex items-center gap-1.5"><input type="radio" name="contractTypeShared" class="accent-blue-600"><span>增值服务合同</span></label>' +
      '          </div>' +
      '          <div class="flex items-center gap-6">' +
      '            <span class="w-20 text-slate-600">合同标签</span>' +
      '            <label class="inline-flex items-center gap-1.5"><input type="radio" name="contractTagShared" class="accent-blue-600" checked><span>新签</span></label>' +
      '            <label class="inline-flex items-center gap-1.5"><input type="radio" name="contractTagShared" class="accent-blue-600"><span>续签</span></label>' +
      '          </div>' +
      '          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">' +
      '            <label class="text-sm"><span class="text-slate-600">企业名称 <span class="text-red-500">*</span></span><input type="text" placeholder="输入企业名称" class="mt-1 w-full h-9 px-3 rounded border border-slate-200"></label>' +
      '            <label class="text-sm"><span class="text-slate-600">联系人</span><input type="text" placeholder="输入联系人姓名" class="mt-1 w-full h-9 px-3 rounded border border-slate-200"></label>' +
      '            <label class="text-sm"><span class="text-slate-600">联系方式 <span class="text-red-500">*</span></span><input type="text" placeholder="输入联系人手机号" class="mt-1 w-full h-9 px-3 rounded border border-slate-200"></label>' +
      '          </div>' +
      '        </div>' +
      '      </section>' +
      '      <section class="border border-slate-200 rounded-lg overflow-hidden">' +
      '        <div class="h-9 px-3 bg-slate-50 text-sm text-slate-700 font-medium flex items-center"><span class="w-1 h-4 rounded bg-blue-600 mr-2"></span>合同信息</div>' +
      '        <div class="p-4 space-y-3 text-sm">' +
      '          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">' +
      '            <label><span class="text-slate-600">所选服务 <span class="text-red-500">*</span></span><select class="mt-1 w-full h-9 px-3 rounded border border-slate-200"><option>请选择</option></select></label>' +
      '            <label><span class="text-slate-600">合同金额(元) <span class="text-red-500">*</span></span><input type="text" placeholder="请输入" class="mt-1 w-full h-9 px-3 rounded border border-slate-200"></label>' +
      '            <label><span class="text-slate-600">付款方式 <span class="text-red-500">*</span></span><select class="mt-1 w-full h-9 px-3 rounded border border-slate-200"><option>年付</option></select></label>' +
      '          </div>' +
      '          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">' +
      '            <label><span class="text-slate-600">合同起止</span><input type="text" value="2026-04-14" class="mt-1 w-full h-9 px-3 rounded border border-slate-200"></label>' +
      '            <label><span class="text-slate-600 invisible">结束</span><input type="text" value="2028-04-14" class="mt-1 w-full h-9 px-3 rounded border border-slate-200"></label>' +
      '            <label><span class="text-slate-600">履约时长</span><input type="text" value="1 年" class="mt-1 w-full h-9 px-3 rounded border border-slate-200"></label>' +
      '            <label><span class="text-slate-600">赠送时长</span><input type="text" value="0 个月" class="mt-1 w-full h-9 px-3 rounded border border-slate-200"></label>' +
      '          </div>' +
      '          <label class="block"><span class="text-slate-600">补充条件</span><textarea rows="3" placeholder="可合同附加正式归档补充" class="mt-1 w-full px-3 py-2 rounded border border-slate-200"></textarea></label>' +
      '        </div>' +
      '      </section>' +
      '      <section class="border border-slate-200 rounded-lg overflow-hidden">' +
      '        <div class="h-9 px-3 bg-slate-50 text-sm text-slate-700 font-medium flex items-center"><span class="w-1 h-4 rounded bg-blue-600 mr-2"></span>签约信息</div>' +
      '        <div class="p-4 space-y-3 text-sm">' +
      '          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">' +
      '            <label><span class="text-slate-600">签约公司 <span class="text-red-500">*</span></span><select class="mt-1 w-full h-9 px-3 rounded border border-slate-200"><option>苏州范阳信息科技有限公司</option></select></label>' +
      '            <label><span class="text-slate-600">签约人 <span class="text-red-500">*</span></span><select class="mt-1 w-full h-9 px-3 rounded border border-slate-200"><option>周方林</option></select></label>' +
      '            <div class="flex items-end"><label class="inline-flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" class="accent-blue-600" checked>需要盖章</label></div>' +
      '          </div>' +
      '          <label class="block"><span class="text-slate-600">合同备注</span><textarea rows="3" maxlength="500" class="mt-1 w-full px-3 py-2 rounded border border-slate-200">请平台合同方注意事项，签字待求实率，此后信息受限不可见，电子后续使用需审批。</textarea></label>' +
      '        </div>' +
      '      </section>' +
      '    </form>' +
      '    <div class="modal-footer-actions h-14 border-t border-slate-100 flex items-center justify-end gap-3 px-6 shrink-0">' +
      '      <button type="button" class="btn-close-create-contract h-9 px-6 rounded-md border border-slate-300 bg-white text-sm text-slate-600 hover:bg-slate-50 shrink-0">取消</button>' +
      '      <button type="button" id="btn-confirm-create-contract" class="h-9 px-6 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shrink-0">确认</button>' +
      '    </div>' +
      '  </div>' +
      '</div>' +
      '<div id="toast-create-contract-success" class="fixed top-6 left-1/2 -translate-x-1/2 z-[130] hidden px-5 py-2.5 rounded-lg bg-slate-800 text-white text-sm shadow-lg" role="status">提交成功</div>';
    document.body.appendChild(wrap);
    return {
      modal: document.getElementById('modal-create-contract'),
      toast: document.getElementById('toast-create-contract-success')
    };
  }

  window.mountCreateContractModal = function (opts) {
    var options = opts || {};
    var selectors = options.openSelectors || ['#btn-open-create-contract'];
    var nodes = ensureModal();
    var modal = nodes.modal;
    var toast = nodes.toast;
    var timer;

    function openModal() {
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
    function closeModal() {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
    function showToast() {
      toast.classList.remove('hidden');
      clearTimeout(timer);
      timer = setTimeout(function () { toast.classList.add('hidden'); }, 2200);
    }

    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (btn) {
        if (btn.dataset.contractModalBound === '1') return;
        btn.dataset.contractModalBound = '1';
        btn.addEventListener('click', openModal);
      });
    });

    if (modal.dataset.contractModalBound !== '1') {
      modal.dataset.contractModalBound = '1';
      modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
      modal.querySelectorAll('.btn-close-create-contract').forEach(function (b) {
        b.addEventListener('click', closeModal);
      });
      var confirmBtn = modal.querySelector('#btn-confirm-create-contract');
      if (confirmBtn) confirmBtn.addEventListener('click', function () { closeModal(); showToast(); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
      });
    }
  };
})();
