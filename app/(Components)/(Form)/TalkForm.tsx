'use client';

import React, {useState} from 'react';
import {Player} from '@remotion/player';
import {VideoTemplate} from '../../../src/Types/VideoTemplate';
import {useInputChange} from '../../../src/Components/hooks/onInputChanges';
import {TalkDefaultProps} from '../../../src/DefaultProps/TalkDefaultProps';
import {format} from 'date-fns';
import fr from 'date-fns/locale/fr';
import {InputSection} from './Inputs/InputSection';
import styles from './styles.module.css';

export const TalkForm: React.FC<{
	currentTemplate: VideoTemplate;
	setLoading: (data: boolean) => void;
	setVideoUrl: (data: string) => void;
	setError: (data: string) => void;
}> = ({currentTemplate, setLoading, setVideoUrl, setError}) => {
	const [title, setTitle] = useInputChange<string>(TalkDefaultProps.title);
	const [date, setDate] = useState(new Date());
	const [speakerName, setSpeakerName] = useInputChange<string>(
		TalkDefaultProps.speaker.name
	);
	const [speakerPicture, setSpeakerPicture] = useInputChange<string>(
		TalkDefaultProps.speaker.picture
	);
	const [speakerRole, setSpeakerRole] = useInputChange<string>(
		TalkDefaultProps.speaker.role
	);
	const [speakerLocation, setSpeakerLocation] = useInputChange<string>(
		TalkDefaultProps.speaker.location
	);

	const talkInputs = {
		title: {
			data: title,
			setData: setTitle,
			label: 'Titre',
		},
		speakerName: {
			data: speakerName,
			setData: setSpeakerName,
			label: 'Nom',
		},
		speakerPicture: {
			data: speakerPicture,
			setData: setSpeakerPicture,
			label: 'Photo',
		},
		speakerRole: {
			data: speakerRole,
			setData: setSpeakerRole,
			label: 'Role',
		},
		speakerLocation: {
			data: speakerLocation,
			setData: setSpeakerLocation,
			label: 'Ville',
		},
		date: {
			data: date,
			setData: setDate,
			label: 'Date',
		},
	};

	const data: {
		title: string;
		date: string;
		speaker: {
			name: string;
			picture: string;
			role: string;
			location: string;
		};
	} = {
		title,
		date: format(date, 'dd MMMM yyyy', {locale: fr}),
		speaker: {
			name: speakerName,
			picture: speakerPicture,
			role: speakerRole,
			location: speakerLocation,
		},
	};

	const handleSubmit: React.FormEventHandler = (event) => {
		event.preventDefault();
		setLoading(true);

		fetch('https://social-video-generatorz-server.cleverapps.io/BotzTalk', {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(data),
		})
			.then((res) => res.blob())
			.then((blob) => {
				const fileURL = URL.createObjectURL(blob);
				setVideoUrl(fileURL);
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
				setError(
					'/!\\ Une erreur est survenu ! Veuillez patienter quelques instants et essayer à nouveaux. /!\\'
				);
			});
	};

	return (
		<div className={styles.VideoFormContainer}>
			<div>
				<Player
					controls
					autoPlay
					loop
					durationInFrames={currentTemplate.durationInFrames}
					fps={30}
					compositionWidth={currentTemplate.width}
					compositionHeight={currentTemplate.height}
					component={currentTemplate.component}
					style={{width: 500, height: 500}}
					inputProps={data}
				/>
			</div>

			<div className={styles.formContainer}>
				<form id={currentTemplate.formId} onSubmit={handleSubmit}>
					<section>
						<InputSection InputList={talkInputs} />
					</section>
				</form>
			</div>
		</div>
	);
};