import PageLayout from "@/components/layouts/PageLayout";
import Header from "@/components/shared/Header";
import GAImportContext, {
  IImportWorkflowConfig,
} from "@/contexts/GAImportContext";
import React, { useEffect, useState } from "react";
import GAImportAuth from "./GAImportAuth";
import { checkGoogleAuth } from "@/handlers/integration.handler";
import GASelectAlbum from "./GASelectAlbum";
import GASelectMedia from "./GASelectMedia";

const getLocalConfig = () => {
  if (typeof localStorage === "undefined") {
    return null;
  }
  const config = localStorage.getItem("importWorkflow");
  if (config) {
    return JSON.parse(config) as IImportWorkflowConfig;
  }
  return null;
};

export default function GoogleAlbumImportFlow() {
  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importWorkflow, setImportWorkflow] =
    React.useState<IImportWorkflowConfig>(
      getLocalConfig() ?? {
        authenticated: false,
        googleAlbumId: null,
        googlePhotoIds: null,
        immichAlbumId: null,
      }
    );

  const fetchData = async () => {
    const localConfig = getLocalConfig();

    return checkGoogleAuth()
      .then((data) => {
        setImportWorkflow((prev) => ({
          ...prev,
          ...localConfig,
          authenticated: data.success,
        }));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("importWorkflow", JSON.stringify(importWorkflow));
  }, [importWorkflow]);

  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    } else if (errorMessage) {
      return <div>{errorMessage}</div>;
    }
    if (!importWorkflow.authenticated) {
      return <GAImportAuth />;
    }
    if (!importWorkflow.googleAlbumId) {
      return (
        <GASelectAlbum
          onSelect={(selectedAlbum) => {
            setImportWorkflow((config) => {
              return {
                ...config,
                googleAlbumId: selectedAlbum.id,
              };
            });
          }}
        />
      );
    }
    if (!importWorkflow.googlePhotoIds) {
      return <GASelectMedia onSelect={(selectedMedia) => {}} />;
    }
    return <div>GoogleAlbumImportFlow</div>;
  };

  return (
    <PageLayout>
      <Header leftComponent="Import Google Photos" />
      <GAImportContext.Provider
        value={{
          ...importWorkflow,
          updateContext: (newConfig: Partial<IImportWorkflowConfig>) => {
            setImportWorkflow((prev) => ({
              ...prev,
              ...newConfig,
            }));
          },
        }}
      >
        {renderContent()}
      </GAImportContext.Provider>
    </PageLayout>
  );
}
