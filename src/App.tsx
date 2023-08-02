import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import './style.css';

export default function App() {
  const [data, setData] = useState([]);
  const [result, setResult] = useState([]);
  const [isThrottled, setIsThrottled] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }, []);

  /**
   * Debounce - If the function is called multiple times at
   * specified interval, only the  last invocation is
   * executed , and previous invocations within the interval
   * are ignored
   */
  const debounceSearch = (fn, arg, delay = 1000) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    let id = setTimeout(() => {
      fn(arg);
    }, delay);
    setTimeoutId(id);
  };

  /**
   * Throttling Search
   * The value will be searched only when the throttling time is ended
   * Example: 'ab' is searched with delay of 100, the user cant search again within the span of 1000 mili seconds.
   */
  const throttleData = (fn, args, delay = 1000) => {
    if (isThrottled) {
      return;
    }
    fn(args);
    setIsThrottled(true);
    setTimeout(() => {
      setIsThrottled(false);
    }, delay);
  };

  const searchData = (searchValue) => {
    if (searchValue.length > 1) {
      let ans = data.map((d) => {
        if (d?.title?.toLowerCase().startsWith(searchValue.toLowerCase()))
          return d.title;
      });
      setResult(ans);
      return;
    }
    setResult([]);
  };
  return (
    <div>
      <h1>Throttle Search</h1>
      <input onChange={(e) => throttleData(searchData, e.target.value, 500)} />
      {result.map((r) => {
        return <div key={r}>{r}</div>;
      })}
      <hr />
      <h1>Debounce Search</h1>
      <input
        onChange={(e) => debounceSearch(searchData, e.target.value, 1000)}
      />
      {result.map((r) => {
        return <div key={r}>{r}</div>;
      })}
    </div>
  );
}
