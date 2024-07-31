function hamit_oyunu
    % Global değişkenler
    global commands userInputs currentStep;
    commands = {};
    userInputs = {};
    currentStep = 1;

    % Ana pencereyi oluştur
    fig = figure('Name', 'Hamit\in Oyunu', 'NumberTitle', 'off', 'Position', [500, 500, 400, 300]);

    % Komut metni
    commandText = uicontrol('Style', 'text', 'Position', [100, 230, 200, 40], 'FontSize', 12);

    % Yeşil ve Kırmızı tuşlar
    greenButton = uicontrol('Style', 'pushbutton', 'String', 'Yeşil', 'Position', [70, 150, 100, 50], ...
        'BackgroundColor', 'green', 'Callback', @greenButtonCallback);
    redButton = uicontrol('Style', 'pushbutton', 'String', 'Kırmızı', 'Position', [230, 150, 100, 50], ...
        'BackgroundColor', 'red', 'Callback', @redButtonCallback);

    % Fire tuşu
    fireButton = uicontrol('Style', 'pushbutton', 'String', 'Fire', 'Position', [150, 80, 100, 50], ...
        'BackgroundColor', 'yellow', 'Callback', @fireButtonCallback);

    % Başla tuşu
    startButton = uicontrol('Style', 'pushbutton', 'String', 'Başla', 'Position', [150, 20, 100, 50], ...
        'Callback', @startButtonCallback);

    % Sonuç metni
    resultText = uicontrol('Style', 'text', 'Position', [50, 280, 300, 40], 'FontSize', 12);

    % Başla tuşuna basılınca çalışacak fonksiyon
    function startButtonCallback(~, ~)
        commands = {};
        userInputs = {};
        currentStep = 1;
        set(resultText, 'String', '');
        generateCommands();
        executeCommands();
    end

    % Komutları oluştur
    function generateCommands()
        for i = 1:6
            if rand < 0.5
                commands{end+1} = 'green';
            else
                commands{end+1} = 'red';
            end
        end
    end

    % Komutları yürüt
    function executeCommands()
        if currentStep <= length(commands)
            set(commandText, 'String', sprintf('Hamit: %s', commands{currentStep}));
            currentStep = currentStep + 1;
            pause(0.5);
            set(commandText, 'String', '');
            pause(0.5);
            executeCommands();
        else
            startCountdown();
        end
    end

    % Geri sayım
    function startCountdown()
        for countdown = 3:-1:1
            set(commandText, 'String', num2str(countdown));
            pause(1);
        end
        set(commandText, 'String', 'Hamit: FIRLAT!!!');
        enableButtons();
    end

    % Tuşları etkinleştir
    function enableButtons()
        set(greenButton, 'Enable', 'on');
        set(redButton, 'Enable', 'on');
        set(fireButton, 'Enable', 'on');
    end

    % Yeşil tuş callback
    function greenButtonCallback(~, ~)
        userInputs{end+1} = 'green';
    end

    % Kırmızı tuş callback
    function redButtonCallback(~, ~)
        userInputs{end+1} = 'red';
    end

    % Fire tuşu callback
    function fireButtonCallback(~, ~)
        set(greenButton, 'Enable', 'off');
        set(redButton, 'Enable', 'off');
        set(fireButton, 'Enable', 'off');
        handleFire();
    end

    % Fire tuşuna basılınca çalışacak fonksiyon
    function handleFire()
        correctSteps = 0;
        for i = 1:length(commands)
            if strcmp(commands{i}, userInputs{i})
                correctSteps = correctSteps + 1;
            end
        end
        % Komutlar ve kullanıcı girdilerini ekrana yazdır
        commandStr = sprintf('Komutlar: %s', strjoin(commands, ', '));
        userInputStr = sprintf('Kullanıcı Girdileri: %s', strjoin(userInputs, ', '));
        if correctSteps >= 5
            set(resultText, 'String', sprintf('ATIŞ BAŞARILI! DOĞRU BASILAN TUŞ SAYISI: %d\n%s\n%s', correctSteps, commandStr, userInputStr));
        else
            set(resultText, 'String', sprintf('ATIŞ BAŞARISIZ! DOĞRU BASILAN TUŞ SAYISI: %d\n%s\n%s', correctSteps, commandStr, userInputStr));
        end
    end
end
