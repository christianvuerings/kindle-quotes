import { useState } from "react";

export const initialRequest = {
  pending: false,
  fulfilled: false,
  rejected: false,
  value: undefined,
  reason: undefined,
};

export function usePromise({
  promiseFunction,
  updateableRequest: updateableRequestProp,
}) {
  const [localRequest, setLocalRequest] = useState(initialRequest);
  const localUpdateableState: UpdateableState = {
    state: localRequest,
    setState: setLocalRequest,
  };

  const updateableRequest = updateableRequestProp || localUpdateableState;

  const updateRequest = (patchRequest) => {
    updateableRequest.setState({
      ...updateableRequest.state,
      ...patchRequest,
    });
  };

  const wrappedPromiseFunction = (...args: []) => {
    updateRequest({ pending: true });
    return promiseFunction.apply(null, args).then(
      (result) => {
        updateRequest({
          pending: false,
          fulfilled: true,
          rejected: false,
          value: result,
        });
        return result;
      },
      (error) => {
        updateRequest({
          pending: false,
          fulfilled: false,
          rejected: true,
          reason: error,
        });
        throw error;
      }
    );
  };

  return { ...updateableRequest.state, call: wrappedPromiseFunction };
}
