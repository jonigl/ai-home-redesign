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
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent p-5 flex flex-col justify-center items-center text-center transition-opacity duration-300 group-hover:from-black/80">
            <h3 className="text-white text-opacity-70 font-extrabold duration-300 group-hover:text-opacity-100">{style.name}</h3>
            <p className="text-white/90 text-xs font-semibold transform translate-y-20 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-10">
              {style.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default StyleSelector;
