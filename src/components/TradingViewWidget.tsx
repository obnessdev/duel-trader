import { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  width?: string;
  height?: string;
}

export const TradingViewWidget = ({
  symbol = "BINANCE:BTCUSDT",
  width = "100%",
  height = "100%"
}: TradingViewWidgetProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${symbol}",
        "interval": "1",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "pt",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com",
        "hide_side_toolbar": true,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "studies": [],
        "show_popup_button": false,
        "popup_width": "1000",
        "popup_height": "650"
      }`;

    // Clear any existing content
    container.current.innerHTML = '';
    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div className="tradingview-widget-container" style={{ height, width }}>
      <div ref={container} className="tradingview-widget-container__widget" style={{ height, width }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://br.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};