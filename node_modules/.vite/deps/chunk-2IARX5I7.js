import {
  require_react
} from "./chunk-BG45W2ER.js";
import {
  __toESM
} from "./chunk-HXA6O6EE.js";

// node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
var React = __toESM(require_react(), 1);
function useCallbackRef(callback) {
  const callbackRef = React.useRef(callback);
  React.useEffect(() => {
    callbackRef.current = callback;
  });
  return React.useMemo(() => (...args) => {
    var _a;
    return (_a = callbackRef.current) == null ? void 0 : _a.call(callbackRef, ...args);
  }, []);
}

export {
  useCallbackRef
};
//# sourceMappingURL=chunk-2IARX5I7.js.map
