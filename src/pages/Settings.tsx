import { Card } from '@components/Card';
import { useSettingsStore } from '@stores/settingsStore';
import { useTheme } from '@contexts/ThemeContext';
import type { ThemeMode } from '@stores/settingsStore';

const themeOptions: ThemeMode[] = ['dark', 'light', 'system'];
const qualityOptions = ['low', 'medium', 'high', 'ultra'] as const;

export function Settings() {
  const { setTheme } = useTheme();
  const { theme, showFps, setShowFps, graphicsQuality, setGraphicsQuality, viewDistance, setViewDistance } =
    useSettingsStore();

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-surface-100">Settings</h1>
        <p className="mt-1 text-surface-400">Personalize your experience.</p>
      </div>

      <div className="flex max-w-2xl flex-col gap-4">
        <Card title="Appearance">
          <div className="flex flex-wrap gap-2">
            {themeOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTheme(option)}
                className={`rounded-lg border px-4 py-2 text-sm capitalize transition-colors ${
                  theme === option
                    ? 'border-primary-500 bg-primary-600/20 text-primary-300'
                    : 'border-surface-600/50 text-surface-300 hover:text-white'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </Card>

        <Card title="Graphics">
          <div className="flex flex-col gap-4">
            <div>
              <span className="mb-2 block text-sm text-surface-400">Quality</span>
              <div className="flex flex-wrap gap-2">
                {qualityOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setGraphicsQuality(option)}
                    className={`rounded-lg border px-4 py-2 text-sm capitalize transition-colors ${
                      graphicsQuality === option
                        ? 'border-primary-500 bg-primary-600/20 text-primary-300'
                        : 'border-surface-600/50 text-surface-300 hover:text-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm text-surface-300">
              <input
                type="checkbox"
                checked={showFps}
                onChange={(event) => setShowFps(event.target.checked)}
                className="size-4 accent-primary-500"
              />
              Show FPS overlay
            </label>
            <div className="flex items-center gap-3 text-sm text-surface-300">
              <span className="shrink-0">View distance</span>
              <input
                type="range"
                min={2}
                max={12}
                value={viewDistance}
                onChange={(event) => setViewDistance(Number(event.target.value))}
                className="w-full accent-primary-500"
              />
              <span className="w-6 text-right text-surface-100">{viewDistance}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
