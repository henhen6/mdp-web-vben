/**
 * Global authority directive
 * Used for fine-grained control of component permissions
 */
import type { App, DirectiveBinding } from 'vue';

import { useAccess } from './use-access';

function hasPermission(el: Element, binding: any) {
  const value = binding.value;
  if (!value) return;
  const { hasPermission } = useAccess();
  if (!hasPermission(value)) {
    el?.remove();
  }
}

function withoutPermission(el: Element, binding: any) {
  const value = binding.value;
  if (!value) return;
  const { withoutPermission } = useAccess();
  if (!withoutPermission(value)) {
    el?.remove();
  }
}

function withoutAnyPermission(el: Element, binding: any) {
  const value = binding.value;
  if (!value) return;
  const { withoutAnyPermission } = useAccess();
  if (!withoutAnyPermission(value)) {
    el?.remove();
  }
}

function hasAnyPermission(el: Element, binding: any) {
  const value = binding.value;
  if (!value) return;
  const { hasAnyPermission } = useAccess();
  if (!hasAnyPermission(value)) {
    el?.remove();
  }
}

export function registerAccessDirective(app: App) {
  // 判断是否"拥有"指定的"所有"权限
  app.directive('hasPermission', {
    mounted: (el: Element, binding: DirectiveBinding<any>) => {
      hasPermission(el, binding);
    },
  });
  // 判断是否"没有"指定的"所有"权限
  app.directive('withoutPermission', {
    mounted: (el: Element, binding: DirectiveBinding<any>) => {
      withoutPermission(el, binding);
    },
  });
  // 判断是否"没有"指定的"任意"权限
  app.directive('withoutAnyPermission', {
    mounted: (el: Element, binding: DirectiveBinding<any>) => {
      withoutAnyPermission(el, binding);
    },
  });
  // 判断是否"拥有"指定的"任意"权限
  app.directive('hasAnyPermission', {
    mounted: (el: Element, binding: DirectiveBinding<any>) => {
      hasAnyPermission(el, binding);
    },
  });
}
