import FindInput from '@/components/find/FindInput';
import PageLayout from '@/components/layouts/PageLayout';
import Header from '@/components/shared/Header';
import { useConfig } from '@/contexts/ConfigContext';
import { LOGO_COLORS } from '@/config/constants/brand';
import { findAssets } from '@/handlers/api/asset.handler';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  MonitorSmartphone,
  Plus,
  SearchX,
  ShieldCheck,
  Sparkles,
  Sun,
  TriangleAlert,
  Video,
  WandSparkles,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, MotionConfig, motion, type Variants } from 'framer-motion';
import AssetGrid from "@/components/shared/AssetGrid";
import FloatingBar from "@/components/shared/FloatingBar";
import AssetsBulkDeleteButton from "@/components/shared/AssetsBulkDeleteButton";
import PhotoSelectionContext, { IPhotoSelectionContext } from '@/contexts/PhotoSelectionContext';
import AlbumSelectorDialog from '@/components/albums/AlbumSelectorDialog';
import { addAssetToAlbum, createAlbum } from '@/handlers/api/album.handler';
import { IAlbum, IAlbumCreate } from '@/types/album';
import { IAsset } from '@/types/asset';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface IFindFilters {
  [key: string]: string | string[] | boolean | number;
}

interface IFindTurn {
  id: number;
  displayQuery: string;
  status: 'loading' | 'done' | 'error';
  assets: IAsset[];
  filters: IFindFilters;
  error?: string;
}

const FILTER_KEY_MAP: Record<string, string> = {
  city: "City",
  state: "State",
  country: "Country",
  takenAfter: "Taken After",
  takenBefore: "Taken Before",
  size: "Size",
  model: "Model",
  personIds: "People",
  type: "Type",
  isFavorite: "Favorite",
}

const SUGGESTIONS = [
  { label: "Last week's photos", query: "Photos from last week", icon: Calendar },
  { label: "Photos from last summer", query: "Photos taken last summer", icon: Sun },
  { label: "Videos from New York", query: "Videos taken in New York", icon: Video },
  { label: "Photos taken in Berlin", query: "Photos taken in Berlin", icon: MapPin },
  { label: "Recent screenshots", query: "Screenshots taken recently", icon: MonitorSmartphone },
];

const spring = { type: 'spring', stiffness: 380, damping: 32, mass: 0.8 } as const;
const softSpring = { type: 'spring', stiffness: 260, damping: 28 } as const;

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring },
};

const pop: Variants = {
  hidden: { opacity: 0, scale: 0.7, y: 6 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 500, damping: 26 } },
};

const filtersToChips = (filters: IFindFilters) => {
  return Object.entries(filters)
    .filter(([key, value]) => {
      if (key === "query") return false;
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== '';
    })
    .map(([key, value]) => ({
      label: FILTER_KEY_MAP[key] || key,
      value: Array.isArray(value) ? value.join(', ') : String(value),
    }));
}

const AiAvatar = ({ thinking }: { thinking?: boolean }) => (
  <div className="relative h-8 w-8 shrink-0">
    <AnimatePresence>
      {thinking && (
        <motion.span
          key="pulse"
          className="absolute inset-0 rounded-full bg-blue-500"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: [0.45, 0], scale: [1, 1.9] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
    </AnimatePresence>
    <motion.div
      className="relative flex h-8 w-8 items-center justify-center rounded-full border bg-card shadow-sm"
      animate={thinking ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={thinking ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : spring}
    >
      <Sparkles className={thinking ? 'h-4 w-4 text-blue-500' : 'h-4 w-4 text-foreground'} />
    </motion.div>
  </div>
);

const ThinkingIndicator = () => (
  <div className="flex w-fit items-center gap-3 rounded-2xl rounded-tl-md border bg-card px-4 py-3">
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-blue-500"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
        />
      ))}
    </div>
    <span className="bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-[length:200%_100%] bg-clip-text text-sm text-transparent animate-shimmer">
      Understanding your query…
    </span>
  </div>
);

const FilterChips = ({ filters }: { filters: IFindFilters }) => {
  const chips = filtersToChips(filters);
  if (chips.length === 0) return null;
  return (
    <motion.div className="flex flex-wrap gap-1.5" variants={stagger} initial="hidden" animate="show">
      {chips.map((chip) => (
        <motion.span
          key={chip.label}
          variants={pop}
          className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-0.5 text-xs"
        >
          <span className="font-medium text-blue-600 dark:text-blue-400">{chip.label}</span>
          <span className="text-muted-foreground">{chip.value}</span>
        </motion.span>
      ))}
    </motion.div>
  );
};

const PrivacyNote = ({ className }: { className?: string }) => (
  <p className={"flex items-center justify-center gap-1.5 text-xs text-muted-foreground " + (className || '')}>
    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
    <span>Your AI model only parses the query — none of your library data is sent to it.</span>
  </p>
);

export default function FindPage() {
  const { toast } = useToast();
  const { aiEnabled } = useConfig();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [turns, setTurns] = useState<IFindTurn[]>([]);
  const turnIdRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [contextState, setContextState] = useState<IPhotoSelectionContext>({
    selectedIds: [],
    assets: [],
    config: {},
    updateContext: (newConfig: Partial<IPhotoSelectionContext>) => {
      setContextState(prevState => ({
        ...prevState,
        ...newConfig,
        config: newConfig.config ? { ...prevState.config, ...newConfig.config } : prevState.config
      }));
    }
  });

  const updateContext = contextState.updateContext;

  // Keep the shared selection context in sync with everything on screen
  useEffect(() => {
    updateContext({ assets: turns.flatMap((turn) => turn.assets) });
  }, [turns, updateContext]);

  // Follow the conversation as turns are added or resolve
  useEffect(() => {
    const id = window.setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 80);
    return () => window.clearTimeout(id);
  }, [turns]);

  const patchTurn = (id: number, patch: Partial<IFindTurn>) => {
    setTurns(prev => prev.map(turn => turn.id === id ? { ...turn, ...patch } : turn));
  }

  const handleSearch = useCallback((searchQuery: string, displayQuery?: string) => {
    if (!searchQuery.trim() || loading) return;
    const id = ++turnIdRef.current;
    setTurns(prev => [...prev, {
      id,
      displayQuery: (displayQuery || searchQuery).trim(),
      status: 'loading',
      assets: [],
      filters: {},
    }]);
    setQuery('');
    setLoading(true);
    updateContext({ selectedIds: [] });
    findAssets(searchQuery)
      .then(({ assets, filters, error }: { assets: IAsset[], filters: IFindFilters, error?: string }) => {
        if (error) {
          patchTurn(id, { status: 'error', filters: filters || {}, error });
        } else {
          patchTurn(id, { status: 'done', assets: assets || [], filters: filters || {} });
        }
      })
      .catch((error: any) => {
        patchTurn(id, { status: 'error', error: error.message || error.error || "Failed to fetch assets" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loading, updateContext]);

  const handleReset = () => {
    setTurns([]);
    setQuery('');
    updateContext({ selectedIds: [], assets: [] });
  }

  const handleSelectionChange = (ids: string[]) => {
    updateContext({ selectedIds: ids });
  }

  const handleDelete = (ids: string[]) => {
    setTurns(prev => prev.map(turn => ({
      ...turn,
      assets: turn.assets.filter((asset) => !ids.includes(asset.id)),
    })));
    updateContext({ selectedIds: [] });
  }

  const handleSelectAlbum = (album: IAlbum) => {
    return addAssetToAlbum(album.id, contextState.selectedIds)
      .then(() => {
        toast({
          title: `Assets added to ${album.albumName}`,
          description: `${contextState.selectedIds.length} assets added to album`,
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to add assets album",
          variant: "destructive",
        });
      });
  };

  const handleCreateAlbum = (formData: IAlbumCreate) => {
    return createAlbum({
      ...formData,
      assetIds: contextState.selectedIds,
    }).then((newAlbum) => {
      toast({
        title: "Album created",
        description: `Album "${newAlbum.albumName}" created successfully with ${contextState.selectedIds.length} assets.`,
      });
    }).catch(() => {
      toast({
        title: "Error creating album",
        description: "Failed to create album",
        variant: "destructive",
      });
    });
  }

  const renderTurnResponse = (turn: IFindTurn) => {
    if (turn.status === 'loading') {
      return (
        <motion.div key="thinking" variants={rise} initial="hidden" animate="show"
          exit={{ opacity: 0, scale: 0.9, y: -6, transition: { duration: 0.18 } }}>
          <ThinkingIndicator />
        </motion.div>
      );
    }
    if (turn.status === 'error') {
      return (
        <motion.div key="error" variants={rise} initial="hidden" animate="show"
          className="flex w-fit max-w-xl items-start gap-3 rounded-2xl rounded-tl-md border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/30 dark:bg-red-500/10">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Oops, something went wrong</p>
            <p className="text-sm text-muted-foreground">{turn.error}</p>
          </div>
        </motion.div>
      );
    }
    return (
      <motion.div key="done" className="flex min-w-0 flex-1 flex-col gap-3"
        variants={stagger} initial="hidden" animate="show">
        <FilterChips filters={turn.filters} />
        {turn.assets.length === 0 ? (
          <motion.div variants={rise} className="flex w-fit items-center gap-3 rounded-2xl rounded-tl-md border bg-card px-4 py-3">
            <SearchX className="h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No matches for that one — try rephrasing or loosening the filters.
            </p>
          </motion.div>
        ) : (
          <>
            <motion.p variants={rise} className="text-xs text-muted-foreground">
              Found {turn.assets.length} {turn.assets.length === 1 ? 'result' : 'results'}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ ...softSpring, delay: 0.15 }}
            >
              <AssetGrid
                assets={turn.assets}
                selectable
                onSelectionChange={handleSelectionChange}
              />
            </motion.div>
          </>
        )}
      </motion.div>
    );
  };

  const renderTurn = (turn: IFindTurn) => (
    <div key={turn.id} className="flex flex-col gap-4">
      <div className="flex justify-end">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={spring}
          style={{ transformOrigin: 'bottom right' }}
          className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm"
        >
          {turn.displayQuery}
        </motion.div>
      </div>
      <motion.div
        className="flex items-start gap-3"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...spring, delay: 0.12 }}
      >
        <AiAvatar thinking={turn.status === 'loading'} />
        <AnimatePresence mode="wait" initial={false}>
          {renderTurnResponse(turn)}
        </AnimatePresence>
      </motion.div>
    </div>
  );

  const renderComposer = (docked: boolean) => (
    <motion.div layoutId="find-composer" layout="position" transition={softSpring} className="w-full">
      <FindInput
        value={query}
        onChange={setQuery}
        onSearch={handleSearch}
        loading={loading}
        autoFocus
        dropdownPlacement={docked ? 'top' : 'bottom'}
      />
    </motion.div>
  );

  const renderHero = () => (
    <motion.div
      key="hero"
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 pb-16"
      variants={stagger}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -24, scale: 0.98, transition: { duration: 0.25, ease: 'easeIn' } }}
    >
      <motion.div variants={rise} className="relative animate-float-slow">
        <motion.div
          className="absolute inset-0 scale-150 rounded-full opacity-50 blur-2xl dark:opacity-40"
          style={{ background: `conic-gradient(from 0deg, ${LOGO_COLORS.join(', ')}, ${LOGO_COLORS[0]})` }}
          animate={{ rotate: 360, scale: [1.5, 1.7, 1.5] }}
          transition={{ rotate: { duration: 14, repeat: Infinity, ease: 'linear' }, scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
        />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border bg-white shadow-lg">
          <Image src="/favicon.png" alt="Immich Power Tools" width={40} height={40} className="h-10 w-10" />
        </div>
      </motion.div>
      <motion.div variants={rise} className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Find anything in your library
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Describe what you&apos;re looking for in plain language.
          Use <kbd className="rounded-md bg-muted px-1.5 py-0.5 text-xs">@</kbd> to search for photos of a specific person.
        </p>
      </motion.div>
      <motion.div variants={rise} className="w-full max-w-2xl">
        {renderComposer(false)}
      </motion.div>
      <motion.div variants={stagger} className="flex max-w-2xl flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <motion.button
            key={suggestion.query}
            variants={pop}
            whileHover={{ y: -3, scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 24 }}
            className="group flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-200 hover:border-foreground/30 hover:bg-accent hover:text-foreground hover:shadow-sm"
            onClick={() => handleSearch(suggestion.query)}
          >
            <suggestion.icon className="h-3.5 w-3.5 text-blue-500" />
            {suggestion.label}
          </motion.button>
        ))}
      </motion.div>
      <motion.div variants={rise}>
        <PrivacyNote />
      </motion.div>
    </motion.div>
  );

  const renderChat = () => (
    <motion.div
      key="chat"
      className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6">
          {turns.map(renderTurn)}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="shrink-0 bg-gradient-to-t from-background via-background to-transparent pt-4">
        <div className="mx-auto w-full max-w-2xl px-4 pb-3">
          {renderComposer(true)}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.4 } }}>
            <PrivacyNote className="mt-2" />
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {contextState.selectedIds.length > 0 && (
          <motion.div
            key="floating-bar"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={spring}
            className="pointer-events-none fixed inset-x-0 bottom-44 z-50 flex justify-center px-4 md:left-[200px] lg:left-[240px]"
          >
            <FloatingBar className="pointer-events-auto !static w-full">
              <p className="text-sm text-muted-foreground">
                {contextState.selectedIds.length} Selected
              </p>
              <div className="flex items-center gap-2">
                <AlbumSelectorDialog onSelected={handleSelectAlbum} onSubmit={handleCreateAlbum} />
                <div className="h-[10px] w-[1px] bg-zinc-500 dark:bg-zinc-600"></div>
                <AssetsBulkDeleteButton
                  selectedIds={contextState.selectedIds}
                  onDelete={handleDelete}
                />
              </div>
            </FloatingBar>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderAiDisabled = () => (
    <div className="flex h-full flex-col items-center justify-center gap-2 py-10">
      <WandSparkles className="h-10 w-10 text-muted-foreground" />
      <p className="text-lg font-semibold">AI parsing is not enabled</p>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        Currently, the Power Tools Find relies on an OpenAI-compatible API for parsing the query.
        Please configure <kbd className="rounded-md bg-muted px-1.5 py-0.5 text-xs">AI_API_KEY</kbd> and <kbd className="rounded-md bg-muted px-1.5 py-0.5 text-xs">AI_MODEL</kbd> in the <kbd className="rounded-md bg-muted px-1.5 py-0.5 text-xs">.env</kbd> file.
      </p>
      <div className="mt-2 rounded-md border border-l-4 p-2">
        <PrivacyNote />
      </div>
    </div>
  );

  return (
    <MotionConfig reducedMotion="user">
      <PageLayout className="gap-0">
        <Header
          leftComponent="Find"
          rightComponent={
            <AnimatePresence>
              {turns.length > 0 && (
                <motion.div
                  key="new-search"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={spring}
                >
                  <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    New search
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          }
        />
        {aiEnabled ? (
          <PhotoSelectionContext.Provider value={{ ...contextState, updateContext }}>
            <LayoutGroup>
              <div className="relative min-h-0 flex-1">
                <AnimatePresence>
                  {turns.length === 0 ? renderHero() : renderChat()}
                </AnimatePresence>
              </div>
            </LayoutGroup>
          </PhotoSelectionContext.Provider>
        ) : renderAiDisabled()}
      </PageLayout>
    </MotionConfig>
  )
}
