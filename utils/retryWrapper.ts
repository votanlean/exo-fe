export interface IRetryOptions {
  retry?: number;
  delay?: number;
}

const RETRY_DEFAULTS: IRetryOptions = {
  retry: 5,
  delay: 1
}

/**
 * a wrapper to retry a promise callback
 * @param callback the callback function to try to execute
 * @param options options to pass into retry
 * @param options.retry number of time to retry
 * @param options.delay the delay time between each retrytime
 * @returns a promise with the type of the callback function return type
 */
export default async function retry(callback: CallableFunction, options: IRetryOptions) {
  const override = {
    ...RETRY_DEFAULTS,
    ...options,
  }

  const delayTime = override.delay * 1000;

  if (!override.retry || override.retry <= 1) {
    return callback();
  }

  for (let i = 0; i < override.retry; i++) {
    try {
      const res = await callback();
      return res;
    } catch (error) {
      if (i >= override.retry) throw error;

      await new Promise((resolve) => {
        setTimeout(resolve, delayTime);
      });
    }
  }
}