import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectElement({ value, setValue, label, options }) {
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">{label}</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={value}
        label={label}
        onChange={handleChange}
      >
        {!value && (
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
        )}
        {options.map((opt, i) => {
          return (
            <MenuItem value={opt.value} key={i}>
              {opt.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
