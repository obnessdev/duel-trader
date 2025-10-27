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
        "hide_side_toolbar": false,
        "withdateranges": false,
        "hide_volume": false,
        "hide_top_toolbar": false,
        "save_image": true,
        "studies": [],
        "show_popup_button": false,
        "drawings_access": {
          "type": "black",
          "tools": [
            { "name": "Cursor", "grayed": false },
            { "name": "LineToolTrendLine", "grayed": false },
            { "name": "LineToolHorzLine", "grayed": false },
            { "name": "LineToolVertLine", "grayed": false },
            { "name": "LineToolRectangle", "grayed": false },
            { "name": "LineToolCircle", "grayed": false },
            { "name": "LineToolText", "grayed": false },
            { "name": "LineToolTextAbsolute", "grayed": false },
            { "name": "LineToolCallout", "grayed": false },
            { "name": "LineToolBalloon", "grayed": false },
            { "name": "LineToolArrow", "grayed": false },
            { "name": "LineToolFibRetracement", "grayed": false },
            { "name": "LineToolFibExtension", "grayed": false },
            { "name": "LineToolPitchfork", "grayed": false },
            { "name": "LineToolBrush", "grayed": false },
            { "name": "LineToolHighlighter", "grayed": false },
            { "name": "LineToolNote", "grayed": false },
            { "name": "LineToolSignpost", "grayed": false },
            { "name": "LineToolFlag", "grayed": false },
            { "name": "LineToolPriceLabel", "grayed": false },
            { "name": "LineToolDateRange", "grayed": false },
            { "name": "LineToolPriceRange", "grayed": false }
          ]
        },
        "enabled_features": [
          "study_templates",
          "use_localstorage_for_settings",
          "save_chart_properties_to_local_storage",
          "create_volume_indicator_by_default",
          "keep_left_toolbar_visible_on_small_screens",
          "chart_crosshair_menu",
          "edit_buttons_in_legend"
        ],
        "disabled_features": [
          "header_symbol_search",
          "symbol_search_hot_key"
        ],
        "popup_width": "1000",
        "popup_height": "650",
        "hideideas": true,
        "overrides": {
          "paneProperties.background": "#131722",
          "paneProperties.vertGridProperties.color": "#363c4e",
          "paneProperties.horzGridProperties.color": "#363c4e",
          "symbolWatermarkProperties.transparency": 90,
          "scalesProperties.textColor": "#AAA",
          "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350"
        }
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
    <div className="tradingview-widget-container relative" style={{ height, width }}>
      <div ref={container} className="tradingview-widget-container__widget" style={{ height, width }}></div>
    </div>
  );
};