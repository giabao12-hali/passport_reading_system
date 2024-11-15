import { Menu, Save, Upload } from "lucide-react";
import React from "react";
import { Container, Button } from 'react-floating-action-button'


interface ButtonFloatActionsMobileProps {
    onSave: () => void;
    onSaveAndUpdateEtour: () => void;
}

const ButtonFloatActionsMobile: React.FC<ButtonFloatActionsMobileProps> = ({ onSave, onSaveAndUpdateEtour }) => {
    return (
        <div className="hidden mobile:block mobile:z-30">
            <Container>
                <Button
                    styles={{ backgroundColor: '#DC5224', color: 'white' }}
                    tooltip="Lưu và Cập nhật eTour"
                    onClick={onSaveAndUpdateEtour}
                >
                    <Upload />
                </Button>
                <Button
                    styles={{ backgroundColor: '#6D90FF', color: 'white' }}
                    tooltip="Lưu tạm"
                    onClick={onSave}
                >
                    <Save />
                </Button>
                <Button
                    styles={{ backgroundColor: '#504f4d', color: '#d6d5d3' }}
                >
                    <Menu />
                </Button>
            </Container>
        </div>
    );
}

export default ButtonFloatActionsMobile;