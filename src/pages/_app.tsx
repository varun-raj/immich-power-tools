import RootLayout from "@/components/layouts/RootLayout";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { ENV } from "@/config/environment";
import ConfigContext, { ConfigContextType } from "@/contexts/ConfigContext";
import { useRef } from "react";
import { ConfigProvider } from "antd";
interface AppPropsWithProps extends AppProps {
  props: ConfigContextType;
}
const App = ({ Component, pageProps, ...props }: AppPropsWithProps) => {
  const intialData = useRef(props.props);

  return (
    <ConfigContext.Provider value={intialData.current}>
      <ConfigProvider theme={{
        token: {
          colorPrimary: "#000000",
        }
      }}>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </ConfigProvider>
    </ConfigContext.Provider>
  );
};

App.getInitialProps = async () => {

  return {
    props: {
      exImmichUrl: ENV.EXTERNAL_IMMICH_URL,
      immichURL: ENV.IMMICH_URL,
      version: ENV.VERSION,
      geminiEnabled: !!ENV.GEMINI_API_KEY?.length,
      googleMapsApiKey: ENV.GOOGLE_MAPS_API_KEY,
    },
  };
};

export default App;
