/**
 * MB-AOS-001 / MD-048 — Dependency Injection container
 */
(function () {
  'use strict';

  const services = Object.create(null);
  const factories = Object.create(null);
  const singletons = Object.create(null);

  function register(name, instance) {
    services[name] = instance;
    return instance;
  }

  function factory(name, fn) {
    factories[name] = fn;
  }

  function singleton(name, fn) {
    factories[name] = function () {
      if (!(name in singletons)) singletons[name] = fn(resolve);
      return singletons[name];
    };
  }

  function resolve(name) {
    if (name in services) return services[name];
    if (name in factories) return factories[name](resolve);
    throw new Error('DI: kayıt yok — ' + name);
  }

  function tryResolve(name) {
    try { return resolve(name); } catch (e) { return null; }
  }

  function has(name) {
    return (name in services) || (name in factories);
  }

  function keys() {
    const set = {};
    Object.keys(services).forEach(function (k) { set[k] = true; });
    Object.keys(factories).forEach(function (k) { set[k] = true; });
    return Object.keys(set).sort();
  }

  function reset() {
    Object.keys(services).forEach(function (k) { delete services[k]; });
    Object.keys(factories).forEach(function (k) { delete factories[k]; });
    Object.keys(singletons).forEach(function (k) { delete singletons[k]; });
  }

  window.AosContainer = {
    register: register,
    factory: factory,
    singleton: singleton,
    resolve: resolve,
    tryResolve: tryResolve,
    has: has,
    keys: keys,
    reset: reset
  };
})();
