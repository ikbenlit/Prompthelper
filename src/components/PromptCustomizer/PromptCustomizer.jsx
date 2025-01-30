import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generateContent } from '../../services/openAIService';
import Modal from '../Modal/Modal';
import SearchableDropdown from '../SearchableDropdown/SearchableDropdown';

export default function PromptCustomizer({ prompt, tones, styles, targets, roles }) {
  const { t } = useTranslation();
  const [selectedTone, setSelectedTone] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [customizedPrompt, setCustomizedPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [selectedFormula, setSelectedFormula] = useState('');
  const [examples, setExamples] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  console.log('Tones received:', JSON.stringify(tones, null, 2));
  console.log('Received data:', { 
    targets: targets?.length, 
    roles: roles?.length 
  });
  console.log('Roles data:', roles);
  console.log('Tone mapping:', tones?.map(tone => ({
    Name: tone.tone_name,
    Effect: tone.tone_description,
    id: tone.tone_id
  })));

  useEffect(() => {
    if (prompt) {
      setOriginalPrompt(prompt.prompt);
      setCustomizedPrompt(prompt.prompt);
      setSelectedFormula(prompt.formula || '');
      setExamples(prompt.more_examples || '');
    }
  }, [prompt]);

  const updatePrompt = (tone, style, target, role) => {
    let newPrompt = '';
    
    if (tone) {
      const selectedTone = tones.find(t => t.id === tone);
      if (selectedTone) {
        newPrompt += `Toon: ${selectedTone.name} - ${selectedTone.description}\n\n`;
      }
    }
    
    if (style) {
      const selectedStyle = styles.find(s => s.Name === style);
      if (selectedStyle) {
        newPrompt += `Stijl: ${selectedStyle.Name} - ${selectedStyle.Effect}\n\n`;
      }
    }

    if (target) {
      const selectedTarget = targets.find(t => t.id === target);
      if (selectedTarget) {
        newPrompt += `Doelgroep: ${selectedTarget.name} - ${selectedTarget.description}\n\n`;
      }
    }

    if (role) {
      const selectedRole = roles.find(r => r.id === role);
      if (selectedRole) {
        newPrompt += `Rol: ${selectedRole.name} - ${selectedRole.description}\n\n`;
      }
    }

    newPrompt += `Prompt:\n${originalPrompt}`;

    setCustomizedPrompt(newPrompt);
  };

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const content = await generateContent(customizedPrompt);
      setGeneratedContent(content);
      setIsModalOpen(true);
    } catch (err) {
      setError(t('errors.generation'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6 relative">
        {/* Tone Selection */}
        <div>
          <SearchableDropdown
            options={tones?.map(tone => ({
              Name: tone.name,
              Effect: tone.description,
              id: tone.id
            }))}
            value={tones?.find(t => t.id === selectedTone)?.name || ''}
            onChange={(value) => {
              const tone = tones.find(t => t.name === value);
              setSelectedTone(tone?.id || '');
              updatePrompt(tone?.id || '', selectedStyle, selectedTarget, selectedRole);
            }}
            label={t('customize.selectTone')}
            placeholder={t('customize.noTone')}
          />
        </div>

        {/* Style Selection */}
        <div>
          <SearchableDropdown
            options={styles}
            value={selectedStyle}
            onChange={(value) => {
              setSelectedStyle(value);
              updatePrompt(selectedTone, value, selectedTarget, selectedRole);
            }}
            label={t('customize.selectStyle')}
            placeholder={t('customize.noStyle')}
          />
        </div>

        {/* Target Selection */}
        <div>
          <SearchableDropdown
            options={targets?.map(target => ({
              Name: target.name,
              Effect: target.description,
              id: target.id
            }))}
            value={targets?.find(t => t.id === selectedTarget)?.name || ''}
            onChange={(value) => {
              const target = targets.find(t => t.name === value);
              setSelectedTarget(target?.id || '');
              updatePrompt(selectedTone, selectedStyle, target?.id || '', selectedRole);
            }}
            label={t('customize.selectTarget')}
            placeholder={t('customize.noTarget')}
          />
        </div>

        {/* Role Selection */}
        <div>
          <SearchableDropdown
            options={roles?.map(role => ({
              Name: role.name,
              Effect: role.description,
              id: role.id
            }))}
            value={roles?.find(r => r.id === selectedRole)?.name || ''}
            onChange={(value) => {
              const role = roles.find(r => r.name === value);
              setSelectedRole(role?.id || '');
              updatePrompt(selectedTone, selectedStyle, selectedTarget, role?.id || '');
            }}
            label={t('customize.selectRole')}
            placeholder={t('customize.noRole')}
          />
        </div>

        {/* Prompt Editor */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              {t('customize.promptText')}
            </label>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('actions.generating')}
                </span>
              ) : (
                t('actions.makeContent')
              )}
            </button>
          </div>
          <textarea
            value={customizedPrompt}
            onChange={(e) => setCustomizedPrompt(e.target.value)}
            className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 min-h-[200px] resize-y text-sm leading-relaxed"
            placeholder={t('customize.editPrompt')}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Generated Content Modal */}
      <div className="relative z-[200]">
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col h-full max-h-[80vh]">
            <h2 className="text-2xl font-bold mb-4">{t('generate.result')}</h2>
            
            <div className="flex-1 overflow-y-auto mb-4">
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{generatedContent}</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-800 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
              >
                {t('actions.close')}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedContent);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {t('actions.copy')}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
} 