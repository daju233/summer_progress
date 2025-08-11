import  { useState, useEffect, useRef } from 'react';
import './App.css';

// 假设有一些图片用于轮播
const images = [
'https://i0.hdslb.com/bfs/new_dyn/00113ce3ede5477a946af2ec8ccbc751401626802.jpg@1192w.avif'
];

function App() {
  const [percentage, setPercentage] = useState(0);
  const [percentageGO, setPercentageGO] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalTime, setTotalTime] = useState(0);
  const [goTime, setGoTime] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // **** 新增的 useEffect 钩子，专门用于获取进度数据 ****
  // 这个 effect 只会在组件首次挂载时运行一次
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('https://api.codetabs.com/v1/proxy?quest=https://wakapi.dev/api/v1/users/Lorange/stats');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const cppLanguage = data.data.languages.find((item: { name: string }) => item.name === 'C++');
        const goLanguage = data.data.languages.find((item: { name: string }) => item.name === 'Go');

        let totalHoursValue = 0; // 使用一个临时变量来存储计算结果
        let totalGoValue = 0;
        if (cppLanguage) {
          // 确保toFixed(2)后的字符串转换为数字
          totalGoValue = parseFloat((goLanguage.hours - 46 + (goLanguage.minutes / 60)).toFixed(2));
          totalHoursValue = parseFloat((cppLanguage.hours - 59 + (cppLanguage.minutes / 60)).toFixed(2));
        } else {
          console.warn("C++ language data not found in API response.");
        }

        const targetHours = 100;
        const targetHoursGo = 70;
        const calculatedPercentage = (totalHoursValue / targetHours) * 100;
        const calculatedPercentageGo = (totalGoValue / targetHoursGo) * 100;

        setTotalTime(totalHoursValue); // 设置为数字类型
        setGoTime(totalGoValue);
        setPercentage(Math.min(100, Math.max(0, calculatedPercentage)));
        setPercentageGO(Math.min(100, Math.max(0, calculatedPercentageGo)));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []); // <--- 关键：空的依赖项数组，确保只运行一次

  // **** 独立的 useEffect 钩子，用于轮播图自动播放逻辑 ****
  // 这个 effect 会在 currentSlide 或 images.length 变化时重新设置定时器
  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    resetTimeout(); // 每次 currentSlide 变化时，清除旧定时器
    timeoutRef.current = setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 7000); // 7秒切换一次

    return () => {
      resetTimeout(); // 清理函数：组件卸载或 effect 重新执行时清除定时器
    };
  }, [currentSlide, images.length]); // 依赖项：currentSlide 变化时重新设置定时器

  // 点击小圆点时的处理函数 (保持不变)
  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    // 点击 dot 时也重置定时器以避免快速切换导致显示问题
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
      }, 7000); // 同样 7秒 后继续自动播放
    }
  };

  if (loading) {
    return <div className="App">加载中，请稍候...</div>;
  }

  if (error) {
    return <div className="App">错误: {error}</div>;
  }

  return (
    <div className="App">
      <h1>🍌🐺的code进度</h1>
      <span className='date'>6.28-8.28</span>
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        >
        </div>
        <span className="percentage-text-centered">
        <span>C++ {totalTime}/100 h</span>
        </span>
      </div>
      <div className="progress-bar-container-go">
        <div
          className="progress-bar-fill-go"
          style={{ width: `${percentageGO}%` }}
        >
        </div>
        <span className="percentage-text-centered">
        <span className='span-go'>Go {goTime}/70 h</span>
        </span>
      </div>
      <div className="carousel-container">
        <div className="carousel-slide">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              className={index === currentSlide ? 'active' : ''}
            />
          ))}
        </div>
        <div className="carousel-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            ></span>
          ))}
        </div>
      
      </div>
      <br />
      <script async src="//finicounter.eu.org/finicounter.js"></script>
      <span>本站访问人数统计  </span>
      <span id="finicount_views"></span>
    </div>
  );
}

export default App;