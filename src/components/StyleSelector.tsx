import { STYLE_PRESETS } from '@/constants/stylePresets';
import { useTransform } from '@/context/TransformContext';

const StyleSelector = () => {
  const { selectedStyle, setSelectedStyle } = useTransform();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
      {STYLE_PRESETS.map((style) => (
        <button
          key={style.id}
          className={`group relative aspect-square rounded-lg overflow-hidden ${
            selectedStyle === style.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setSelectedStyle(style.id)}
        >
          <img
            src={style.image}
            alt={style.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
            <h3 className="text-white font-medium text-sm">{style.name}</h3>
            <p className="text-white/80 text-xs hidden group-hover:block">
              {style.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default StyleSelector;
